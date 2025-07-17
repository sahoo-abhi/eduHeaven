import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUpload, 
  FaArrowLeft, 
  FaFile, 
  FaTimes,
  FaCheck,
  FaSpinner
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { 
  storeLargeFile, 
  storeSmallFile, 
  formatFileSize,
  getStorageInfo,
  canStoreFile
} from "../utils/fileStorage";

const UploadNotes = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (!currentUser || selectedFiles.length === 0) return;

    // Check file sizes before uploading
    const maxFileSize = 100 * 1024 * 1024; // 100MB per file (increased)
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 500 * 1024 * 1024; // 500MB total for all files (increased)

    if (totalSize > maxTotalSize) {
      alert(`Total file size (${formatFileSize(totalSize)}) exceeds the limit of ${formatFileSize(maxTotalSize)}. Please select smaller files or fewer files.`);
      return;
    }

    const oversizedFiles = selectedFiles.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      alert(`The following files are too large (max ${formatFileSize(maxFileSize)} per file): ${fileNames}`);
      return;
    }

    // Check storage capacity before upload
    try {
      const storageInfo = await getStorageInfo();
      
      // Check if we have enough space (with 10MB safety margin)
      const safetyMargin = 10 * 1024 * 1024; // 10MB
      if (storageInfo.available < (totalSize + safetyMargin)) {
        const usedMB = (storageInfo.usage / (1024 * 1024)).toFixed(1);
        const totalMB = (storageInfo.quota / (1024 * 1024)).toFixed(1);
        const uploadMB = (totalSize / (1024 * 1024)).toFixed(1);
        
        alert(`Not enough storage space! You need ${uploadMB}MB but only have ${(storageInfo.available / (1024 * 1024)).toFixed(1)}MB available. Currently using ${usedMB}MB of ${totalMB}MB total storage. Please delete some files and try again.`);
        return;
      }
    } catch (error) {
      console.warn('Could not check storage capacity:', error);
      // Continue with upload if storage check fails
    }

    setUploading(true);
    const progress = {};
    
    try {
      const uploadedFiles = [];
      
      for (const fileData of selectedFiles) {
        const { file, id } = fileData;
        progress[id] = 0;
        setUploadProgress({...progress});

        const fileId = `${Date.now()}_${Math.random()}_${Math.floor(Math.random() * 1000)}`;
        const fileSizeInMB = file.size / (1024 * 1024);
        
        progress[id] = 20;
        setUploadProgress({...progress});
        
        let fileObj;
        
        if (fileSizeInMB > 1) { // Reduced from 2MB to 1MB threshold for IndexedDB
          // Use IndexedDB for files larger than 1MB
          progress[id] = 30;
          setUploadProgress({...progress});
          
          const metadata = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            subject,
            uploadedBy: currentUser.uid,
            uploadedAt: new Date().toISOString()
          };
          
          await storeLargeFile(fileId, file, metadata);
          
          progress[id] = 80;
          setUploadProgress({...progress});
          
          fileObj = {
            id: fileId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            isLargeFile: true,
            subject,
            uploadedBy: currentUser.uid,
            uploadedAt: new Date().toISOString()
          };
        } else {
          // Use localStorage for smaller files, but with fallback to IndexedDB
          progress[id] = 30;
          setUploadProgress({...progress});
          
          try {
            const base64Data = await storeSmallFile(file);
            
            // Test if this would fit in localStorage along with existing data
            const testKey = `test_${fileId}`;
            try {
              localStorage.setItem(testKey, base64Data);
              localStorage.removeItem(testKey);
              
              // It fits, use localStorage
              progress[id] = 80;
              setUploadProgress({...progress});
              
              fileObj = {
                id: fileId,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                data: base64Data,
                isLargeFile: false,
                subject,
                uploadedBy: currentUser.uid,
                uploadedAt: new Date().toISOString()
              };
            } catch (storageError) {
              // Fallback to IndexedDB if localStorage is full
              console.warn('localStorage full, using IndexedDB for file:', file.name);
              
              const metadata = {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                subject,
                uploadedBy: currentUser.uid,
                uploadedAt: new Date().toISOString()
              };
              
              await storeLargeFile(fileId, file, metadata);
              
              progress[id] = 80;
              setUploadProgress({...progress});
              
              fileObj = {
                id: fileId,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                isLargeFile: true,
                subject,
                uploadedBy: currentUser.uid,
                uploadedAt: new Date().toISOString()
              };
            }
          } catch (error) {
            console.error('Error processing file:', error);
            throw new Error(`Failed to process file ${file.name}`);
          }
        }
        
        uploadedFiles.push(fileObj);
        progress[id] = 100;
        setUploadProgress({...progress});
      }

      // Store file metadata in localStorage
      const existingFiles = JSON.parse(localStorage.getItem(`notes_${subject}`) || '[]');
      const updatedFiles = [...existingFiles, ...uploadedFiles];
      
      try {
        localStorage.setItem(`notes_${subject}`, JSON.stringify(updatedFiles));
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          const storageInfo = await getStorageInfo();
          alert(`Storage quota exceeded! You are using ${formatFileSize(storageInfo.total)} of storage. Please delete some files and try again.`);
          return;
        } else {
          throw storageError;
        }
      }

      // Clear selected files and navigate to view notes
      setSelectedFiles([]);
      setTimeout(() => {
        navigate(`/view-notes/${subject}`);
      }, 1000);
      
    } catch (error) {
      console.error("Error uploading files:", error);
      if (error.name === 'QuotaExceededError') {
        alert("Storage limit reached. Please delete some existing files and try again.");
      } else {
        alert("Error uploading files. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const subjectDisplayName = subject?.replace(/-/g, ' ').toUpperCase() || 'UNKNOWN';

  return (
    <>
      <Navbar />
      <div className="dashboard-bg pt-20">
        <main className="main-content">
          <div className="dashboard-container">
            {/* Header */}
            <motion.div 
              className="dashboard-welcome-card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              
              <motion.div
                className="dashboard-welcome-title relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Upload Notes - {subjectDisplayName} 📁
              </motion.div>
              
              <motion.div
                className="dashboard-welcome-desc relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Upload your study materials and notes for easy access
              </motion.div>
              
              {/* Storage Usage Indicator */}
              <motion.div
                className="storage-usage-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="storage-usage-title">📊 Storage Information</div>
                <div className="storage-usage-details">
                  Max file size: 100MB per file | Max total per upload: 500MB<br />
                  Files are stored locally on your device for offline access
                </div>
              </motion.div>
            </motion.div>

            {/* Upload Area */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* File Drop Zone */}
              <div 
                className={`upload-drop-zone mb-6 ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const files = Array.from(e.dataTransfer.files);
                  const newFiles = files.map(file => ({
                    file,
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type
                  }));
                  setSelectedFiles(prev => [...prev, ...newFiles]);
                }}
              >
                <FaUpload className="upload-icon mx-auto" />
                <h3 className="upload-title">
                  Drag & Drop or Click to Browse
                </h3>
                <p className="upload-subtitle">
                  Supports PDF, DOC, DOCX, PPT, PPTX, TXT, and image files<br />
                  Maximum file size: 100MB per file
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <label
                  htmlFor="file-upload"
                  className="upload-button"
                >
                  <FaFile /> Choose Files
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <motion.div
                  className="selected-files-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="selected-files-title">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedFiles.map((fileData) => (
                      <motion.div
                        key={fileData.id}
                        className="file-item slide-in-right"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="file-info">
                          <FaFile className="file-icon" />
                          <div>
                            <div className="file-name">{fileData.name}</div>
                            <div className="file-size">
                              {formatFileSize(fileData.size)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="file-actions">
                          {uploading && uploadProgress[fileData.id] !== undefined && (
                            <div className="progress-indicator">
                              {uploadProgress[fileData.id] === 100 ? (
                                <FaCheck className="progress-complete" />
                              ) : (
                                <>
                                  <FaSpinner className="progress-spinner" />
                                  <span>
                                    {uploadProgress[fileData.id]}%
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                          
                          {!uploading && (
                            <button
                              onClick={() => removeFile(fileData.id)}
                              className="remove-file-btn"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Upload Button */}
              {selectedFiles.length > 0 && (
                <motion.div
                  className="text-center fade-in-up"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={uploadFiles}
                    disabled={uploading}
                    className={`upload-progress-btn ${uploading ? 'opacity-50' : ''}`}
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="upload-actions-spacing flex justify-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button
                  onClick={() => navigate(`/view-notes/${subject}`)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  View Uploaded Notes
                </button>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UploadNotes;

import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaUpload, 
  FaFile, 
  FaTrash,
  FaSpinner,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaCheckCircle,
  FaEye
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { 
  storeLargeFile, 
  getStorageInfo, 
  formatFileSize,
  canStoreFile
} from "../utils/fileStorage";

const UploadPapers = () => {
  const { subject, paperType } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const subjectDisplayName = subject?.replace(/-/g, ' ').toUpperCase() || 'UNKNOWN';
  const paperTypeDisplayName = paperType === 'mid-sem' ? 'Mid Semester' : 'End Semester';

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit (increased)
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
      
      if (!isValidSize) {
        alert(`File ${file.name} is too large. Maximum size is 100MB.`);
        return false;
      }
      if (!isValidType) {
        alert(`File ${file.name} is not a supported format. Please upload PDF or image files.`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('image')) return <FaFileImage className="text-green-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }

    // Check storage capacity before upload
    try {
      const totalUploadSize = selectedFiles.reduce((sum, file) => sum + file.file.size, 0);
      const storageInfo = await getStorageInfo();
      
      // Check if we have enough space (with 10MB safety margin)
      const safetyMargin = 10 * 1024 * 1024; // 10MB
      if (storageInfo.available < (totalUploadSize + safetyMargin)) {
        const usedMB = (storageInfo.usage / (1024 * 1024)).toFixed(1);
        const totalMB = (storageInfo.quota / (1024 * 1024)).toFixed(1);
        const uploadMB = (totalUploadSize / (1024 * 1024)).toFixed(1);
        
        alert(`Not enough storage space! You need ${uploadMB}MB but only have ${(storageInfo.available / (1024 * 1024)).toFixed(1)}MB available. Currently using ${usedMB}MB of ${totalMB}MB total storage. Please delete some files and try again.`);
        return;
      }
    } catch (error) {
      console.warn('Could not check storage capacity:', error);
      // Continue with upload if storage check fails
    }

    setUploading(true);
    const uploadedFiles = [];
    const progress = {};

    try {
      for (const fileData of selectedFiles) {
        const { id, file } = fileData;
        
        progress[id] = 20;
        setUploadProgress({...progress});

        const fileId = `papers_${subject}_${paperType}_${Date.now()}_${Math.random()}`;
        let fileObj;

        progress[id] = 40;
        setUploadProgress({...progress});

        if (file.size > 5 * 1024 * 1024) { // 5MB threshold for IndexedDB
          // Store large files in IndexedDB
          progress[id] = 60;
          setUploadProgress({...progress});
          
          const metadata = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            subject,
            paperType,
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
            paperType,
            uploadedBy: currentUser.uid,
            uploadedAt: new Date().toISOString()
          };
        } else {
          // Store small files as base64 in localStorage, but check if localStorage can handle it
          progress[id] = 60;
          setUploadProgress({...progress});
          
          try {
            const base64Data = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
            
            // Check if this would fit in localStorage by testing storage
            const testKey = `test_${fileId}`;
            try {
              localStorage.setItem(testKey, base64Data);
              localStorage.removeItem(testKey);
            } catch (storageError) {
              // If it doesn't fit in localStorage, use IndexedDB instead
              const metadata = {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                subject,
                paperType,
                uploadedBy: currentUser.uid,
                uploadedAt: new Date().toISOString()
              };
              
              await storeLargeFile(fileId, file, metadata);
              
              fileObj = {
                id: fileId,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                isLargeFile: true,
                subject,
                paperType,
                uploadedBy: currentUser.uid,
                uploadedAt: new Date().toISOString()
              };
            }
            
            if (!fileObj) {
              // File fits in localStorage
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
                paperType,
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
      const existingFiles = JSON.parse(localStorage.getItem(`papers_${subject}_${paperType}`) || '[]');
      const updatedFiles = [...existingFiles, ...uploadedFiles];
      
      try {
        localStorage.setItem(`papers_${subject}_${paperType}`, JSON.stringify(updatedFiles));
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          try {
            const storageInfo = await getStorageInfo();
            const usedMB = (storageInfo.usage / (1024 * 1024)).toFixed(1);
            const totalMB = (storageInfo.quota / (1024 * 1024)).toFixed(1);
            
            alert(`Storage quota exceeded! You are using ${usedMB}MB of ${totalMB}MB available storage (${storageInfo.percentage}%). Please delete some files and try again.`);
          } catch (infoError) {
            alert('Storage quota exceeded! Please delete some existing files and try again.');
          }
          return;
        }
        throw storageError;
      }

      alert(`Successfully uploaded ${uploadedFiles.length} file(s)!`);
      setSelectedFiles([]);
      setUploadProgress({});
      
    } catch (error) {
      console.error('Upload error:', error);
      if (error.name === 'QuotaExceededError') {
        try {
          const storageInfo = await getStorageInfo();
          const usedMB = (storageInfo.usage / (1024 * 1024)).toFixed(1);
          const totalMB = (storageInfo.quota / (1024 * 1024)).toFixed(1);
          
          alert(`Storage limit reached! You are using ${usedMB}MB of ${totalMB}MB available storage. Please delete some existing files and try again.`);
        } catch (infoError) {
          alert('Storage limit reached! Please delete some existing files and try again.');
        }
      } else {
        alert('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

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
                Upload {paperTypeDisplayName} Papers - {subjectDisplayName} 📄
              </motion.div>
              
              <motion.div
                className="dashboard-welcome-desc relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Upload question papers for {paperTypeDisplayName.toLowerCase()} examination
              </motion.div>
            </motion.div>

            {/* Upload Area */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div 
                className={`upload-drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon">
                  <FaUpload />
                </div>
                <div className="upload-title">
                  Drop your question papers here
                </div>
                <div className="upload-subtitle">
                  or click to browse files (PDF, JPG, PNG - Max 100MB per file)
                </div>
                <button className="upload-button">
                  <FaFile /> Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  style={{ display: 'none' }}
                />
              </div>
            </motion.div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <motion.div
                className="selected-files-container max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="selected-files-title">
                  Selected Files ({selectedFiles.length})
                </div>
                
                {selectedFiles.map((fileData) => (
                  <div key={fileData.id} className="file-item">
                    <div className="file-info">
                      <div className="file-icon">
                        {getFileIcon(fileData.type)}
                      </div>
                      <div>
                        <div className="file-name">{fileData.name}</div>
                        <div className="file-size">{formatFileSize(fileData.size)}</div>
                      </div>
                    </div>
                    
                    <div className="file-actions">
                      {uploading && uploadProgress[fileData.id] !== undefined ? (
                        <div className="progress-indicator">
                          {uploadProgress[fileData.id] === 100 ? (
                            <FaCheckCircle className="progress-complete" />
                          ) : (
                            <>
                              <FaSpinner className="progress-spinner" />
                              <span>{uploadProgress[fileData.id]}%</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => removeFile(fileData.id)}
                          className="remove-file-btn"
                          disabled={uploading}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {!uploading && (
                  <motion.div
                    className="upload-actions-spacing flex justify-center gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <button
                      onClick={handleUpload}
                      className="upload-button"
                      disabled={uploading || selectedFiles.length === 0}
                    >
                      <FaUpload /> Upload Papers
                    </button>
                  </motion.div>
                )}

                {uploading && (
                  <div className="text-center mt-6">
                    <div className="upload-progress-btn">
                      <FaSpinner className="animate-spin" />
                      Uploading files...
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* View Papers Button */}
            {selectedFiles.length === 0 && (
              <motion.div
                className="upload-actions-spacing flex justify-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button
                  onClick={() => navigate(`/view-papers/${subject}/${paperType}`)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  <FaEye /> View Uploaded Papers
                </button>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div 
              className="dashboard-footer mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <div className="dashboard-footer-content">
                <motion.span
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Building a comprehensive question paper repository for all students
                </motion.span>
                <div className="dashboard-footer-divider"></div>
                <span className="dashboard-footer-brand">eduHeaven</span>
                <motion.span
                  className="dashboard-footer-emoji"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  📄
                </motion.span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UploadPapers;

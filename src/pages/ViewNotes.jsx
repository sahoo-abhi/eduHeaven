import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaFile, 
  FaDownload, 
  FaExternalLinkAlt,
  FaTrash,
  FaUpload,
  FaSpinner,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileImage,
  FaFileAlt
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { 
  retrieveLargeFile, 
  deleteLargeFile, 
  formatFileSize 
} from "../utils/fileStorage";

const ViewNotes = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [subject, currentUser]);

  const fetchFiles = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Get files from localStorage
      const storedFiles = localStorage.getItem(`notes_${subject}`);
      const files = storedFiles ? JSON.parse(storedFiles) : [];
      
      // Show all files for the subject (no user filtering)
      // Sort by upload date (newest first)
      files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      
      setFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FaFileWord className="text-blue-500" />;
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return <FaFilePowerpoint className="text-orange-500" />;
    if (fileType.includes('image')) return <FaFileImage className="text-green-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleDownload = async (fileData) => {
    try {
      let blob;
      
      if (fileData.isLargeFile) {
        // Get file from IndexedDB
        const fileResult = await retrieveLargeFile(fileData.id);
        if (!fileResult) {
          alert('File not found in storage');
          return;
        }
        blob = new Blob([fileResult.data], { type: fileData.fileType });
      } else {
        // Get file from base64 data
        const base64Data = fileData.data;
        const response = await fetch(base64Data);
        blob = await response.blob();
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileData.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const handleViewInNewTab = async (fileData) => {
    try {
      let blob;
      
      if (fileData.isLargeFile) {
        // Get file from IndexedDB
        const fileResult = await retrieveLargeFile(fileData.id);
        if (!fileResult) {
          alert('File not found in storage');
          return;
        }
        blob = new Blob([fileResult.data], { type: fileData.fileType });
      } else {
        // Get file from base64 data
        const base64Data = fileData.data;
        const response = await fetch(base64Data);
        blob = await response.blob();
      }
      
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error('Error viewing file:', error);
      alert('Error viewing file. Please try again.');
    }
  };

  const handleDelete = async (fileData) => {
    if (!confirm(`Are you sure you want to delete "${fileData.fileName}"?`)) return;
    
    setDeleting(fileData.id);
    try {
      // Delete from IndexedDB if it's a large file
      if (fileData.isLargeFile) {
        await deleteLargeFile(fileData.id);
      }
      
      // Remove from localStorage metadata
      const existingFiles = JSON.parse(localStorage.getItem(`notes_${subject}`) || '[]');
      const updatedFiles = existingFiles.filter(f => f.id !== fileData.id);
      localStorage.setItem(`notes_${subject}`, JSON.stringify(updatedFiles));
      
      // Update local state
      setFiles(prev => prev.filter(f => f.id !== fileData.id));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    } finally {
      setDeleting(null);
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
                View Notes - {subjectDisplayName} 📚
              </motion.div>
              
              <motion.div
                className="dashboard-welcome-desc relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Access and manage your uploaded study materials
              </motion.div>
            </motion.div>

            {/* Upload Button */}
            <motion.div
              className="flex justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              
              {files.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all files for this subject? This cannot be undone.')) {
                      localStorage.removeItem(`notes_${subject}`);
                      setFiles([]);
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaTrash /> Clear All
                </button>
              )}
            </motion.div>

            {/* Files List */}
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {loading ? (
                <div className="text-center py-16">
                  <FaSpinner className="animate-spin text-4xl text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-400">Loading your files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-16">
                  <FaFile className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No files uploaded yet</h3>
                  <p className="text-gray-400 mb-6">Start by uploading your study materials</p>
                  <button
                    onClick={() => navigate(`/upload-notes/${subject}`)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    <FaUpload /> Upload Files
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl transition-all group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">
                            {getFileIcon(file.fileType)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="text-white font-semibold text-lg mb-1">
                              {file.fileName}
                            </div>
                            <div className="text-gray-400 text-sm space-y-1">
                              <div>{formatFileSize(file.fileSize)}</div>
                              <div>Uploaded: {formatDate(file.uploadedAt)}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* View in New Tab */}
                          <motion.button
                            onClick={() => handleViewInNewTab(file)}
                            className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all shadow-lg hover:shadow-green-500/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="View in new tab"
                          >
                            <FaExternalLinkAlt />
                          </motion.button>
                          
                          {/* Download */}
                          <motion.button
                            onClick={() => handleDownload(file)}
                            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Download file"
                          >
                            <FaDownload />
                          </motion.button>
                          
                          {/* Delete */}
                          <motion.button
                            onClick={() => handleDelete(file)}
                            disabled={deleting === file.id}
                            className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Delete file"
                          >
                            {deleting === file.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Footer */}
            {files.length > 0 && (
              <motion.div 
                className="dashboard-footer mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="dashboard-footer-content">
                  <motion.span
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {files.length} file{files.length > 1 ? 's' : ''} available for {subjectDisplayName}
                  </motion.span>
                  <div className="dashboard-footer-divider"></div>
                  <span className="dashboard-footer-brand">eduHeaven</span>
                  <motion.span
                    className="dashboard-footer-emoji"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    📁
                  </motion.span>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ViewNotes;

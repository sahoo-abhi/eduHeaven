import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaFileAlt,
  FaCalendarAlt
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { 
  retrieveLargeFile, 
  deleteLargeFile, 
  formatFileSize 
} from "../utils/fileStorage";

const ViewSchedules = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [currentUser]);

  const fetchFiles = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Get files from localStorage
      const storedFiles = localStorage.getItem('lecture_schedules');
      const files = storedFiles ? JSON.parse(storedFiles) : [];
      
      // Show all files (no user filtering for schedules as they're shared)
      // Sort by upload date (newest first)
      files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      
      setFiles(files);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInNewTab = async (file) => {
    try {
      if (file.isLargeFile) {
        // Handle large files from IndexedDB
        const fileData = await retrieveLargeFile(file.id);
        if (fileData && fileData.data) {
          const blob = new Blob([fileData.data], { type: file.fileType });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          // Don't revoke the URL - let the browser handle cleanup
        }
      } else {
        // Handle small files from localStorage (base64)
        if (file.data) {
          // Convert base64 to blob for better PDF handling
          const response = await fetch(file.data);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          // Don't revoke the URL - let the browser handle cleanup
        }
      }
    } catch (error) {
      console.error('Error viewing file:', error);
      alert('Error opening file. Please try again.');
    }
  };

  const handleDownload = async (file) => {
    try {
      if (file.isLargeFile) {
        // Handle large files from IndexedDB
        const fileData = await retrieveLargeFile(file.id);
        if (fileData && fileData.data) {
          const blob = new Blob([fileData.data], { type: file.fileType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      } else {
        // Handle small files from localStorage (base64)
        if (file.data) {
          const a = document.createElement('a');
          a.href = file.data;
          a.download = file.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    
    setDeleting(fileId);
    try {
      // Find the file to determine if it's a large file
      const fileToDelete = files.find(f => f.id === fileId);
      
      // Delete from IndexedDB if it's a large file
      if (fileToDelete && fileToDelete.isLargeFile) {
        await deleteLargeFile(fileId);
      }
      
      // Update the stored files list (remove from localStorage)
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      localStorage.setItem('lecture_schedules', JSON.stringify(updatedFiles));
      
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-green-500" />;
      case 'csv':
      case 'xls':
      case 'xlsx':
        return <FaFileAlt className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const handleUploadNew = () => {
    navigate('/upload-schedule');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-bg">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <main className="dashboard-main" style={{ paddingTop: "4rem" }}>
          <div className="dashboard-container">
            {/* Header */}
            <motion.div 
              className="dashboard-welcome-card"
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              

              <motion.div
                className="dashboard-welcome-title relative z-10"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  marginBottom: "0.5em",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Lecture Schedules 📅
                </span>
              </motion.div>
              
              <motion.div
                className="dashboard-welcome-desc relative z-10"
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 400,
                  opacity: 0.95,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Access and manage all lecture schedules and timetables
              </motion.div>
            </motion.div>

            {/* Files List */}
            <motion.div
              className="max-w-4xl mx-auto space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="animate-spin text-3xl text-blue-400" />
                  <span className="ml-3 text-white/80">Loading schedules...</span>
                </div>
              ) : files.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="dashboard-card p-8">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-white/80 mb-2">
                      No Schedules Found
                    </h3>
                    <p className="text-white/60 mb-6">
                      No lecture schedules have been uploaded yet. Be the first to upload a schedule!
                    </p>
                    <motion.button
                      onClick={handleUploadNew}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaUpload className="inline mr-2" />
                      Upload First Schedule
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    className="bg-gray-800/60 backdrop-blur-lg border border-gray-600/30 rounded-lg p-4 hover:bg-gray-700/60 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-lg flex-shrink-0">
                          {getFileIcon(file.fileName)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {file.fileName}
                          </h3>
                          <div className="text-sm text-gray-400">
                            Size: {formatFileSize(file.fileSize)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Uploaded: {new Date(file.uploadedAt).toLocaleDateString()} {new Date(file.uploadedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <motion.button
                          onClick={() => handleViewInNewTab(file)}
                          className="px-3 py-1.5 bg-purple-600/80 hover:bg-purple-600 rounded text-white text-sm transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="View in New Tab"
                        >
                          <FaExternalLinkAlt />
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleDownload(file)}
                          className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 rounded text-white text-sm transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Download"
                        >
                          <FaDownload />
                        </motion.button>
                        
                        {currentUser?.uid === file.uploadedBy && (
                          <motion.button
                            onClick={() => handleDelete(file.id)}
                            disabled={deleting === file.id}
                            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 rounded text-white text-sm transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Delete"
                          >
                            {deleting === file.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="dashboard-footer mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="dashboard-footer-content">
                <motion.span
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Keeping everyone organized with comprehensive lecture schedules
                </motion.span>
                <div className="dashboard-footer-divider"></div>
                <span className="dashboard-footer-brand">eduHeaven</span>
                <motion.span
                  className="dashboard-footer-emoji"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  📅
                </motion.span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ViewSchedules;

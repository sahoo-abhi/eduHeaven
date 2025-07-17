// File storage utility for handling large files with IndexedDB and localStorage
const DB_NAME = 'eduHeavenFiles';
const DB_VERSION = 2;
const STORE_NAME = 'files';
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for large files

// Initialize IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Delete old object store if it exists
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      
      // Create new object store
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('subject', 'subject', { unique: false });
      store.createIndex('uploadedBy', 'uploadedBy', { unique: false });
      store.createIndex('chunkIndex', 'chunkIndex', { unique: false });
    };
  });
};

// Convert file to chunks for storage
const fileToChunks = async (file) => {
  const chunks = [];
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(chunk);
    });
    
    chunks.push({
      index: i,
      data: arrayBuffer,
      size: end - start
    });
  }
  
  return chunks;
};

// Store large file in IndexedDB with chunking
export const storeLargeFile = async (fileId, file, metadata) => {
  try {
    // Store file in chunks
    const chunks = await fileToChunks(file);
    const totalChunks = chunks.length;
    
    const db = await initDB();
    
    // Store each chunk in a separate transaction
    for (let i = 0; i < chunks.length; i++) {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const chunkData = {
        id: `${fileId}_chunk_${i}`,
        fileId: fileId,
        chunkIndex: i,
        totalChunks: totalChunks,
        data: chunks[i].data,
        size: chunks[i].size,
        ...metadata
      };
      
      await new Promise((resolve, reject) => {
        const request = store.put(chunkData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    }
    
    // Store file metadata in a separate transaction
    const metaTransaction = db.transaction([STORE_NAME], 'readwrite');
    const metaStore = metaTransaction.objectStore(STORE_NAME);
    
    const fileMetadata = {
      id: fileId,
      isMetadata: true,
      totalChunks: totalChunks,
      originalSize: file.size,
      ...metadata
    };
    
    await new Promise((resolve, reject) => {
      const request = metaStore.put(fileMetadata);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      
      metaTransaction.oncomplete = () => resolve();
      metaTransaction.onerror = () => reject(metaTransaction.error);
    });
    
    return true;
  } catch (error) {
    console.error('Error storing large file:', error);
    throw error;
  }
};

// Retrieve large file from IndexedDB
export const retrieveLargeFile = async (fileId) => {
  try {
    const db = await initDB();
    
    // Get file metadata
    const metaTransaction = db.transaction([STORE_NAME], 'readonly');
    const metaStore = metaTransaction.objectStore(STORE_NAME);
    
    const metadata = await new Promise((resolve, reject) => {
      const request = metaStore.get(fileId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      metaTransaction.oncomplete = () => resolve(request.result);
      metaTransaction.onerror = () => reject(metaTransaction.error);
    });
    
    if (!metadata || !metadata.isMetadata) {
      throw new Error('File metadata not found');
    }
    
    // Get all chunks
    const chunks = [];
    for (let i = 0; i < metadata.totalChunks; i++) {
      const chunkTransaction = db.transaction([STORE_NAME], 'readonly');
      const chunkStore = chunkTransaction.objectStore(STORE_NAME);
      const chunkId = `${fileId}_chunk_${i}`;
      
      const chunk = await new Promise((resolve, reject) => {
        const request = chunkStore.get(chunkId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        
        chunkTransaction.oncomplete = () => resolve(request.result);
        chunkTransaction.onerror = () => reject(chunkTransaction.error);
      });
      
      if (!chunk) {
        throw new Error(`Chunk ${i} not found`);
      }
      
      chunks.push(chunk);
    }
    
    // Sort chunks by index (just to be safe)
    chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
    
    // Combine chunks into single ArrayBuffer
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    for (const chunk of chunks) {
      const chunkView = new Uint8Array(chunk.data);
      combinedView.set(chunkView, offset);
      offset += chunk.size;
    }
    
    return {
      data: combinedBuffer,
      metadata: metadata
    };
  } catch (error) {
    console.error('Error retrieving large file:', error);
    throw error;
  }
};

// Delete large file from IndexedDB
export const deleteLargeFile = async (fileId) => {
  try {
    const db = await initDB();
    
    // Get file metadata to know how many chunks to delete
    const metaTransaction = db.transaction([STORE_NAME], 'readonly');
    const metaStore = metaTransaction.objectStore(STORE_NAME);
    
    const metadata = await new Promise((resolve, reject) => {
      const request = metaStore.get(fileId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      metaTransaction.oncomplete = () => resolve(request.result);
      metaTransaction.onerror = () => reject(metaTransaction.error);
    });
    
    if (metadata && metadata.isMetadata) {
      // Delete all chunks
      for (let i = 0; i < metadata.totalChunks; i++) {
        const chunkTransaction = db.transaction([STORE_NAME], 'readwrite');
        const chunkStore = chunkTransaction.objectStore(STORE_NAME);
        const chunkId = `${fileId}_chunk_${i}`;
        
        await new Promise((resolve, reject) => {
          const request = chunkStore.delete(chunkId);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
          
          chunkTransaction.oncomplete = () => resolve();
          chunkTransaction.onerror = () => reject(chunkTransaction.error);
        });
      }
    }
    
    // Delete metadata
    const deleteTransaction = db.transaction([STORE_NAME], 'readwrite');
    const deleteStore = deleteTransaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = deleteStore.delete(fileId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      
      deleteTransaction.oncomplete = () => resolve();
      deleteTransaction.onerror = () => reject(deleteTransaction.error);
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting large file:', error);
    throw error;
  }
};

// Store small file in localStorage as base64
export const storeSmallFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get storage usage information
export const getStorageInfo = async () => {
  try {
    let quota = 0;
    let usage = 0;
    
    // Try to get storage estimate from navigator.storage API
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate && typeof estimate.quota === 'number' && estimate.quota > 0) {
          quota = estimate.quota;
        }
        if (estimate && typeof estimate.usage === 'number' && estimate.usage >= 0) {
          usage = estimate.usage;
        }
      } catch (e) {
        console.warn('Storage estimate not available:', e);
      }
    }
    
    // Calculate localStorage usage manually
    let localStorageSize = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage[key];
          if (typeof value === 'string') {
            localStorageSize += (value.length + key.length) * 2; // UTF-16 encoding
          }
        }
      }
    } catch (e) {
      console.warn('Cannot access localStorage:', e);
    }
    
    // Use better fallback values and ensure we have valid numbers
    const fallbackQuota = 100 * 1024 * 1024; // 100MB fallback (more generous)
    
    // Ensure we have valid numbers
    quota = (quota && quota > 0) ? quota : fallbackQuota;
    usage = Math.max(usage || 0, localStorageSize);
    
    // Ensure usage doesn't exceed quota
    usage = Math.min(usage, quota);
    
    const available = Math.max(0, quota - usage);
    const percentage = quota > 0 ? Math.round((usage / quota) * 100) : 0;
    
    return {
      quota: quota,
      usage: usage,
      available: available,
      percentage: percentage,
      // Legacy properties for backward compatibility
      indexedDB: usage,
      localStorage: localStorageSize,
      total: usage
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    // Return safe fallback values with proper numbers
    const fallbackQuota = 100 * 1024 * 1024; // 100MB
    return { 
      quota: fallbackQuota,
      usage: 0, 
      available: fallbackQuota,
      percentage: 0,
      indexedDB: 0,
      localStorage: 0,
      total: 0
    };
  }
};

// Check if file can be stored based on available space
export const canStoreFile = async (fileSize) => {
  try {
    const storageInfo = await getStorageInfo();
    const safetyMargin = 10 * 1024 * 1024; // 10MB safety margin
    return storageInfo.available > (fileSize + safetyMargin);
  } catch (error) {
    console.error('Error checking storage capacity:', error);
    return false;
  }
};

// Test localStorage capacity
export const testLocalStorageCapacity = () => {
  try {
    const testKey = 'test_storage_capacity';
    const testData = 'x'.repeat(1024); // 1KB test data
    
    // Try to store test data
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    
    return true;
  } catch (error) {
    console.warn('localStorage capacity test failed:', error);
    return false;
  }
};

// Format bytes to human readable format
export const formatFileSize = (bytes) => {
  // Handle invalid inputs
  if (typeof bytes !== 'number' || bytes < 0 || isNaN(bytes) || !isFinite(bytes)) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  
  // Ensure we don't go beyond our sizes array
  const sizeIndex = Math.min(Math.max(i, 0), sizes.length - 1);
  return size + ' ' + sizes[sizeIndex];
};

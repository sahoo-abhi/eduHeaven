// Utility functions for Firestore operations with error handling and retry logic

/**
 * Retry a Firestore operation with exponential backoff
 * @param {Function} operation - The Firestore operation to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Promise that resolves with the operation result
 */
export const retryFirestoreOperation = async (operation, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        operation(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), 15000)
        )
      ]);
      return result;
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.code === 'permission-denied' || 
          error.code === 'unauthenticated' ||
          error.message.includes('User not found')) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Check if the error is a network-related error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
  return error.code === 'unavailable' || 
         error.code === 'deadline-exceeded' ||
         error.message.includes('network') ||
         error.message.includes('timeout') ||
         error.message.includes('fetch');
};

/**
 * Get a user-friendly error message
 * @param {Error} error - The error to format
 * @returns {string} - User-friendly error message
 */
export const getFirestoreErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  switch (error.code) {
    case 'permission-denied':
      return 'You don\'t have permission to perform this action.';
    case 'unauthenticated':
      return 'Please sign in to continue.';
    case 'not-found':
      return 'The requested data was not found.';
    case 'already-exists':
      return 'This data already exists.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

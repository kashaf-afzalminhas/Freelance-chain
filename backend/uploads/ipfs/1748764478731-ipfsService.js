import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

// This function sends a file to the backend and expects the IPFS hash in the response
export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/api/upload-to-ipfs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.hash) {
      return response.data.hash;
    } else {
      throw new Error('IPFS upload failed: Invalid response from backend');
    }
  } catch (error) {
    console.error('Error uploading file to IPFS via backend:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`IPFS upload failed: ${error.response.data.error}`);
    } else {
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }
}; 
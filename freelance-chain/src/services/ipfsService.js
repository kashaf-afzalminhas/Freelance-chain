import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

// This function sends a file to the backend and expects the IPFS hash in the response
export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/api/ipfs/upload-to-ipfs`, formData, {
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

// Function to download a file from IPFS using the actual IPFS hash
export const downloadFromIPFS = async (hash) => {
  try {
    if (!hash) {
      throw new Error('No file hash provided');
    }

    console.log('Downloading file with hash:', hash);

    // First check if the file exists and get its info
    const encodedHash = encodeURIComponent(hash);
    console.log('Encoded hash for info request:', encodedHash);
    
    const infoResponse = await axios.get(`${API_URL}/api/ipfs/info/${encodedHash}`);
    console.log('Info response:', infoResponse.data);
    
    if (!infoResponse.data.success || !infoResponse.data.fileInfo.exists) {
      throw new Error('File not found');
    }

    // Get the actual file hash from the info response
    const actualHash = infoResponse.data.fileInfo.hash;
    console.log('Found actual file hash:', actualHash);

    // Now download using the actual hash
    const downloadResponse = await axios.get(`${API_URL}/api/ipfs/download/${encodeURIComponent(actualHash)}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream'
      }
    });

    // Check if the response is actually a blob
    if (!(downloadResponse.data instanceof Blob)) {
      throw new Error('Invalid file data received');
    }

    // Create a blob URL from the response
    const blob = new Blob([downloadResponse.data], { type: downloadResponse.headers['content-type'] || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    
    // Get filename from content-disposition header or use a default
    let filename = 'downloaded-file';
    const contentDisposition = downloadResponse.headers['content-disposition'];
    if (contentDisposition) {
      // Try to extract filename* (RFC 5987)
      let filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]+)/);
      if (filenameMatch) {
        filename = decodeURIComponent(filenameMatch[1]);
      } else {
        // Fallback to filename="..."
        filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
    }
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading file from IPFS:', error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    throw new Error(`Failed to download file: ${error.message}`);
  }
};

// Function to download work submission file using contract ID
export const downloadWorkSubmission = async (contractId) => {
  try {
    if (!contractId) {
      throw new Error('No contract ID provided');
    }

    console.log('Fetching work submission for contract:', contractId);

    // First, get the work submission details to get the correct file hash
    const workResponse = await axios.get(`${API_URL}/work/${contractId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!workResponse.data.success || !workResponse.data.data) {
      throw new Error('Could not find work submission details');
    }

    // Get the file hash from either the work submission or contract data
    const fileHash = workResponse.data.data.fileHash || workResponse.data.data.workHash;
    
    if (!fileHash) {
      throw new Error('No file hash found in work submission');
    }

    console.log('Found file hash for work submission:', fileHash);

    // Now download the file using the hash
    return await downloadFromIPFS(fileHash);
  } catch (error) {
    console.error('Error downloading work submission:', error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    throw new Error(`Failed to download work submission: ${error.message}`);
  }
};
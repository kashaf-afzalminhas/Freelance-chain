import React, { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Video } from 'lucide-react';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif',
  'application/pdf', 'video/mp4',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const EditBidModal = ({ bid, onClose, onSubmit }) => {
  const [proposal, setProposal] = useState(bid.proposal);
  const [bidAmount, setBidAmount] = useState(bid.bidAmount);
  const [estimatedTime, setEstimatedTime] = useState(bid.estimatedTime);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState(bid.bidMedia || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ALLOWED_TYPES.includes(file.type);
      const isValidSize = file.size <= 20 * 1024 * 1024;
      if (!isValidType) {
        setError('Invalid file type. Only images, PDFs, videos, and documents are allowed.');
        return false;
      }
      if (!isValidSize) {
        setError('File size must be less than 20MB');
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFilePreview = (file) => {
    if (file.type?.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt={file.name} className="h-10 w-10 object-cover rounded mr-2" />;
    }
    if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <FileText className="h-6 w-6 text-red-500 mr-2" />;
    }
    if (file.type?.startsWith('video/')) {
      return <Video className="h-6 w-6 text-purple-500 mr-2" />;
    }
    return <FileText className="h-6 w-6 text-gray-500 mr-2" />;
  };

  const handleFileClick = (file) => {
    if (file.type === 'image' || file.type === 'pdf') {
      window.open(`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${file.url}`, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${file.url}`;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (proposal.length < 50) {
      setError('Proposal must be at least 50 characters');
      return;
    }

    if (isNaN(bidAmount)) {
      setError('Please enter a valid bid amount');
      return;
    }

    if (bidAmount < 0.001) {
      setError('Bid amount must be at least 0.001 ETH');
      return;
    }

    setIsSubmitting(true);
    setError('');

    console.log('EditBidModal handleSubmit: selectedFiles', selectedFiles);
    console.log('EditBidModal handleSubmit: existingFiles', existingFiles);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('proposal', proposal);
      formData.append('bidAmount', bidAmount);
      formData.append('estimatedTime', estimatedTime);

      // Append each new file
      selectedFiles.forEach((file, index) => {
        console.log(`Appending file ${index + 1}:`, file.name, file.type, file.size);
        formData.append('bidMedia', file);
      });

      // Append existing files that weren't removed
      existingFiles.forEach((file, index) => {
        formData.append('existingFiles', JSON.stringify(file));
      });

      // Log the FormData contents for debugging
      console.log('Submitting bid update with files:', {
        newFiles: selectedFiles.map(f => ({
          name: f.name,
          type: f.type,
          size: f.size
        })),
        existingFiles: existingFiles
      });

      onSubmit(formData);
    } catch (err) {
      console.error("Bid update error:", err);
      setError(err.message || "Failed to update bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-secondary">Edit Proposal</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Proposal</label>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                rows={8}
                required
              />
              <p className="text-sm text-gray-500 mt-1">{proposal.length} / 50 characters minimum</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Bid Amount (ETH)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  step="0.001"
                  min="0.001"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Estimated Time</label>
                <select
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                >
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                  <option value="custom">Custom timeline</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Supporting Documents</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileSelect}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.mp4,.doc,.docx"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Up to 5 files, 20MB each. Supported formats: Images, PDFs, Videos, Documents
                  </p>
                </div>
              </div>

              {/* Existing Files */}
              {existingFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Files:</h4>
                  <div className="space-y-2">
                    {existingFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <div 
                          className="flex items-center flex-1"
                          onClick={() => handleFileClick(file)}
                        >
                          {file.type === 'image' ? (
                            <img 
                              src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${file.url}`} 
                              alt={file.name} 
                              className="h-10 w-10 object-cover rounded mr-2"
                            />
                          ) : (
                            <FileText className="h-6 w-6 text-gray-500 mr-2" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600 truncate max-w-xs">{file.name}</span>
                            <span className="text-xs text-gray-400">
                              {file.type === 'image' ? 'Image' : 
                               file.type === 'pdf' ? 'PDF' : 
                               file.type === 'video' ? 'Video' : 'Document'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExistingFile(index);
                          }}
                          className="text-gray-400 hover:text-gray-500 ml-2"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">New Files:</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          {getFilePreview(file)}
                          <span className="text-sm text-gray-600 truncate max-w-xs">{file.name}</span>
                          <span className="text-xs text-gray-400 ml-2">{(file.size / 1024).toFixed(1)}KB</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBidModal;
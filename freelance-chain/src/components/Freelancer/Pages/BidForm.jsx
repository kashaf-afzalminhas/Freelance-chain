import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../../context/Web3Context";
import { bidService } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText, Image as ImageIcon, Video } from 'lucide-react';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif',
  'application/pdf', 'video/mp4',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const BidForm = ({ jobId, onSubmit }) => {
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("7 days");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [topBids, setTopBids] = useState([]);
  const [loadingTopBids, setLoadingTopBids] = useState(true);

  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBids = async () => {
      try {
        const response = await bidService.getTopBids(jobId);
        setTopBids(response.data);
      } catch (err) {
        console.error('Error fetching top bids:', err);
      } finally {
        setLoadingTopBids(false);
      }
    };
    if (jobId) fetchTopBids();
  }, [jobId]);

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

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt={file.name} className="h-10 w-10 object-cover rounded mr-2" />;
    }
    if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <FileText className="h-6 w-6 text-red-500 mr-2" />;
    }
    if (file.type.startsWith('video/')) {
      return <Video className="h-6 w-6 text-purple-500 mr-2" />;
    }
    return <FileText className="h-6 w-6 text-gray-500 mr-2" />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      connectWallet();
      return;
    }
    if (!jobId) {
      setError("Invalid job ID");
      return;
    }
    if (proposal.length < 50) {
      setError("Proposal must be at least 50 characters");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const numericBidAmount = parseFloat(bidAmount);
      if (isNaN(numericBidAmount)) throw new Error("Please enter a valid bid amount");
      if (numericBidAmount < 0.001) throw new Error("Bid amount must be at least 0.001 ETH");

      // Create FormData object
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('proposal', proposal);
      formData.append('bidAmount', numericBidAmount);
      formData.append('estimatedTime', estimatedTime);
      formData.append('freelancerAddress', account);

      // Append each file with proper field name
      selectedFiles.forEach((file, index) => {
        console.log(`Appending file ${index + 1}:`, file.name, file.type, file.size);
        formData.append('bidMedia', file);
      });

      // Log the FormData contents for debugging
      console.log('Submitting bid with files:', selectedFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size
      })));

      const result = await bidService.submitBid(formData);
      
      if (result.success) {
        setSuccess(true);
        setProposal("");
        setBidAmount("");
        setEstimatedTime("7 days");
        setSelectedFiles([]);
        setTimeout(() => {
          if (typeof onSubmit === 'function') onSubmit();
          else navigate(`/jobs/${jobId}`);
        }, 3000);
      } else {
        throw new Error(result.message || "Bid submission failed");
      }
    } catch (err) {
      console.error("Bid submission error:", err);
      setError(err.message || "Failed to submit bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-8 bg-white rounded-lg shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-secondary">Submit Your Proposal</h3>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Proposal submitted successfully!
          </p>
        </div>
      )}
      {!loadingTopBids && topBids.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
          <h4 className="font-semibold mb-2">Current Top Bids:</h4>
          <div className="flex flex-wrap gap-2">
            {topBids.map((bid, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 rounded-full text-sm">
                {bid.bidAmount} ETH
              </span>
            ))}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className={`space-y-6 ${success ? 'opacity-50 pointer-events-none' : ''}`}>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Your Proposal</label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
            minLength={50}
            rows={6}
            placeholder="Describe how you'll approach this project, your relevant experience, and why you're the best candidate for this job..."
            required
          />
          <p className="mt-1 text-sm text-gray-500">{proposal.length} / 50 characters minimum</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Bid Amount (ETH)</label>
            <div className="relative">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 pr-12"
                step="0.001"
                min="0.001"
                placeholder="0.000"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">ETH</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">Estimated Delivery Time</label>
            <select
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 bg-white"
            >
              <option value="7 days">7 days</option>
              <option value="14 days">14 days</option>
              <option value="30 days">30 days</option>
              <option value="Custom">Custom timeline</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Supporting Documents (Optional)</label>
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
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
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
          )}
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || success}
            className={`w-full md:w-auto px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 transition duration-200 ${(isSubmitting || success) ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Proposal...
              </span>
            ) : (
              "Submit Proposal"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BidForm;
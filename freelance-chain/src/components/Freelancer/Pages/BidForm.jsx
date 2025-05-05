import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../../context/Web3Context";
import { bidService } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const BidForm = ({ jobId }) => {
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("7 days");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { account } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) {
      setError("Invalid job ID. Please navigate to this page from a valid job listing.");
      console.error("Invalid jobId:", jobId);
      navigate('/jobs');
    }
  }, [jobId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!jobId) {
      setError("Invalid job ID. Cannot submit bid.");
      return;
    }
  
    if (proposal.length < 50) {
      setError("Proposal must be at least 50 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const numericBidAmount = parseFloat(bidAmount);
      if (isNaN(numericBidAmount)) {
        throw new Error("Please enter a valid bid amount");
      }
      if (numericBidAmount < 0.001) {
        throw new Error("Bid amount must be at least 0.001 ETH");
      }

      const bidData = {
        jobId,
        proposal,
        bidAmount: numericBidAmount,
        estimatedTime,
        freelancerAddress: account
      };

      const result = await bidService.submitBid(bidData);

      if (result.success) {
        alert("Bid submitted successfully!");
        setProposal("");
        setBidAmount("");
        setEstimatedTime("7 days");
        setError("");
        navigate(`/jobs/${jobId}`);
      } else {
        throw new Error(result.message || "Bid submission failed");
      }
    } catch (err) {
      console.error("Bid submission error:", err);
      setError(err.message || "Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="bg-[#0C3B2E] py-4 px-6">
        <h2 className="text-2xl font-bold text-white">Submit Your Bid</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {!jobId && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded mb-4">
            <p className="text-red-700">Error: No job specified. Please navigate to this page from a valid job listing.</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Proposal Details (minimum 50 characters)</label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              required
              minLength={50}
              placeholder="Describe how you plan to approach this project..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D9773] min-h-32"
            />
            <p className="text-sm text-gray-500">{proposal.length}/50 characters minimum</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bid Amount (ETH)</label>
              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  placeholder="0.001"
                  step="0.001"
                  min="0.001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
                />
                <span className="absolute right-3 top-3 text-gray-500">ETH</span>
              </div>
              <p className="text-sm text-gray-500">Minimum bid: 0.001 ETH</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Estimated Time</label>
              <select
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D9773] bg-white"
              >
                <option value="7 days">7 days</option>
                <option value="14 days">14 days</option>
                <option value="30 days">30 days</option>
                <option value="custom">Custom timeframe</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!account || isSubmitting || !jobId}
              className={`w-full md:w-auto px-6 py-3 rounded-md font-medium text-white ${
                !account || isSubmitting || !jobId
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#6D9773] hover:bg-[#5c8162] transition-colors duration-200"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Place Bid"
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          By submitting this bid, you agree to complete the work as described if selected.
        </p>
      </div>
    </div>
  );
};

export default BidForm;
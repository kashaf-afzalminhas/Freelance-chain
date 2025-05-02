import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import api from "../services/api";

const BidForm = ({ jobId }) => {
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("7"); // Default: 7 days
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { account } = useWeb3();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/bids/submit", {
        jobId,
        proposal,
        bidAmount,
        estimatedTime: `${estimatedTime} days`,
      });
      alert("Bid submitted successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit Your Bid</h3>
      
      <div>
        <label>Proposal</label>
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Bid Amount (ETH)</label>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Estimated Time (days)</label>
        <select
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
        >
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={!account || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Place Bid"}
      </button>
    </form>
  );
};

export default BidForm;
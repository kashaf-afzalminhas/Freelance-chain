import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";

const BidList = () => {
  const { jobId } = useParams();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get(`/bids/job/${jobId}`);
        setBids(res.data);
      } catch (err) {
        console.error("Failed to fetch bids:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [jobId]);

  if (loading) return <p>Loading bids...</p>;

  return (
    <div>
      <h3>Bids Received</h3>
      {bids.length === 0 ? (
        <p>No bids yet</p>
      ) : (
        bids.map((bid) => (
          <div key={bid._id} className="bid-card">
            <p><strong>Freelancer:</strong> {bid.freelancerId.name}</p>
            <p><strong>Bid Amount:</strong> {bid.bidAmount} ETH</p>
            <p><strong>Time:</strong> {bid.estimatedTime}</p>
            <p><strong>Proposal:</strong> {bid.proposal}</p>
            <button onClick={() => handleAcceptBid(bid._id)}>Accept Bid</button>
          </div>
        ))
      )}
    </div>
  );
};

export default BidList;
import React, { useEffect, useState } from 'react';
import api from '../../../services/api'; // Adjust the import path as necessary

const JobBidsList = ({ jobId }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.get(`/bids/job/${jobId}`);
        setBids(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load bids');
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [jobId]);

  if (loading) return <div>Loading bids...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="bids-list">
      <h3>Proposals ({bids.length})</h3>
      
      {bids.length === 0 ? (
        <div>No proposals yet</div>
      ) : (
        <div className="list-group">
          {bids.map(bid => (
            <div key={bid._id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <h5>{bid.freelancer.name}</h5>
                  <div className="text-muted">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-end">
                  <div className="h4">{bid.amount} ETH</div>
                  <div>{bid.timeline}</div>
                </div>
              </div>
              
              <div className="mt-3">
                <p>{bid.proposal}</p>
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-sm btn-outline-success">
                  Accept Proposal
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  Reject
                </button>
                <button className="btn btn-sm btn-outline-primary">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBidsList;
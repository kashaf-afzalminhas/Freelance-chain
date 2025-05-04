import { Link } from 'react-router-dom';
// import Rating from './Rating';

const BidCard = ({ bid, onAccept, onReject, isClientView }) => {
  return (
    <div className={`bid-card ${bid.status}`}>
      <div className="bid-header">
        <Link to={`/jobs/${bid.job}`} className="job-title">
          {bid.jobTitle || 'Project'}
        </Link>
        <span className={`status-badge ${bid.status}`}>
          {bid.status}
        </span>
      </div>
      
      <div className="freelancer-info">
        <img 
          src={bid.freelancer.profilePicture || '/default-avatar.png'} 
          alt={bid.freelancer.name}
          className="avatar"
        />
        <div>
          <h4>{bid.freelancer.name}</h4>
          {/* <Rating value={bid.freelancer.rating} /> */}
        </div>
      </div>
      
      <div className="bid-details">
        <div className="detail">
          <span>Bid Amount:</span>
          <strong>{bid.amount} ETH</strong>
        </div>
        <div className="detail">
          <span>Timeline:</span>
          <strong>{bid.timeline}</strong>
        </div>
        <div className="detail">
          <span>Submitted:</span>
          <strong>{new Date(bid.createdAt).toLocaleDateString()}</strong>
        </div>
      </div>
      
      <div className="proposal">
        <h5>Proposal:</h5>
        <p>{bid.proposal}</p>
      </div>
      
      {isClientView && bid.status === 'pending' && (
        <div className="bid-actions">
          <button 
            onClick={onAccept}
            className="btn-accept"
          >
            Accept Proposal
          </button>
          <button 
            onClick={onReject}
            className="btn-reject"
          >
            Reject
          </button>
          <Link 
            to={`/messages/new?userId=${bid.freelancer._id}&jobId=${bid.job}`}
            className="btn-message"
          >
            Message
          </Link>
        </div>
      )}
      
      {isClientView && bid.status === 'accepted' && (
        <div className="accepted-actions">
          <Link 
            to={`/contracts/create?jobId=${bid.job}&bidId=${bid._id}`}
            className="btn-create-contract"
          >
            Create Contract
          </Link>
        </div>
      )}
    </div>
  );
};

export default BidCard;
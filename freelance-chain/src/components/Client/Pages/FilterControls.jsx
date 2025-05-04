const FilterControls = ({ filters, onChange }) => {
    const handleChange = (e) => {
      onChange({ [e.target.name]: e.target.value });
    };
  
    return (
      <div className="filter-controls">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            name="status" 
            value={filters.status}
            onChange={handleChange}
          >
            <option value="all">All Bids</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort By:</label>
          <select 
            name="sort" 
            value={filters.sort}
            onChange={handleChange}
          >
            <option value="newest">Newest First</option>
            <option value="lowest">Lowest Bid Amount</option>
            <option value="highest">Highest Bid Amount</option>
          </select>
        </div>
      </div>
    );
  };
  
  export default FilterControls;
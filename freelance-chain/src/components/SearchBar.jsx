import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  className,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative bg-gray-100 rounded-lg flex items-center",
        className
      )}
    >
      <Search 
        size={18} 
        className="absolute left-3 text-gray-500" 
      />
      
      <input
        type="text"
        className="w-full bg-transparent border-none rounded-lg py-2 pl-10 pr-8 outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;



import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  className,
  disabled = false,
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

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Trigger search on each change for real-time filtering
    onSearch(value);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative flex items-center transition-all duration-200",
        "bg-gray-50 rounded-full border border-gray-300",
        "focus-within:ring-2 focus-within:ring-highlight focus-within:border-transparent",
        "hover:border-gray-400",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <Search 
        size={18} 
        className={cn(
          "absolute left-4",
          disabled ? "text-gray-400" : "text-gray-500"
        )} 
      />
      
      <input
        type="text"
        disabled={disabled}
        className={cn(
          "w-full bg-transparent border-none rounded-full py-3 pl-11 pr-10 outline-none",
          "font-body text-gray-800 placeholder-gray-400",
          "text-sm md:text-base",
          disabled && "cursor-not-allowed"
        )}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      
      {query && (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className={cn(
            "absolute right-3 p-1 rounded-full transition-colors",
            disabled ? "text-gray-400" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
          )}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
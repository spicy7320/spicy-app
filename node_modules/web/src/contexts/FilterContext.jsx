import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    location: 'All',
    serviceType: 'All',
    category: 'All',
    searchQuery: ''
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
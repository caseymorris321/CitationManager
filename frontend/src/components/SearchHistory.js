// SearchHistory.js
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useAuthContext } from '../hooks/useAuthContext';

const SearchHistory = ({ timestamp }) => {
  const { user } = useAuthContext();
  const [searchHistory, setSearchHistory] = useState([]);
  const [displayedItemsCount, setDisplayedItemsCount] = useState(5);

  const fetchSearchHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/search/search-history`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data);
      } else {
        console.log('Failed to fetch search history');
      }
    } catch (error) {
      console.log('Error fetching search history:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    }
  }, [user, fetchSearchHistory, timestamp]);

  const handleShowMore = () => {
    setDisplayedItemsCount((prevCount) => prevCount + 5);
  };

  const handleClearHistory = async () => {
    const confirmClear = window.confirm('Are you sure you want to clear your search history?');
    if (confirmClear) {
      try {
        const response = await fetch(`/api/search/search-history`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          setSearchHistory([]);
        }
      } catch (error) {
        console.log('Error clearing search history:', error);
      }
    }
  };

  return (
    <div className="search-history">
      <h3>Search History</h3>
      <ul>
        {searchHistory.slice(0, displayedItemsCount).map((search, index) => (
          <li key={index}>
            {search.searchQuery} - {new Date(search.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
      {searchHistory.length > displayedItemsCount && (
        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}
      {searchHistory.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <Button variant="danger" onClick={handleClearHistory}>
            Clear History
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
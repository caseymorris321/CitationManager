// SearchForm.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useCitationsContext } from '../hooks/useCitationsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const SearchForm = ({ onNewSearchQuery }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { dispatch } = useCitationsContext();
  const { user } = useAuthContext();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!user) {
      console.log('You must be logged in to search citations');
      return;
    }

    try {
      const response = await fetch(`/api/search/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_CITATIONS', payload: data });

        // Add search query to history
        const historyResponse = await fetch(`/api/search/search-history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ searchQuery }),
        });

        if (historyResponse.ok) {
          onNewSearchQuery();
        }
      } else {
        console.log('Failed to search citations');
      }
    } catch (error) {
      console.log('Error searching citations:', error);
    }
  };

  const handleClear = async () => {
    setSearchQuery('');
    
    try {
      const response = await fetch('/api/citations', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_CITATIONS', payload: data });
      } else {
        console.log('Failed to fetch citations');
      }
    } catch (error) {
      console.log('Error fetching citations:', error);
    }
  };

  return (
    <Form onSubmit={handleSearch}>
      <Form.Group controlId="searchQuery">
        <Form.Label>Search Citations</Form.Label>
        <Form.Control
          className='w-25 mb-3'
          type="text"
          placeholder="Enter search query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      <Button className="me-2" variant="primary" onClick={handleSearch}>
        Search
      </Button>
      <Button variant="secondary" onClick={handleClear}>
        Clear
      </Button>
    </Form>
  );
};

export default SearchForm;
// SortForm.js
import React from 'react';
import { Form } from 'react-bootstrap';

const SortForm = ({ sortField, sortOrder, onSortChange }) => {
  return (
    <Form>
      <Form.Group controlId="sortField" className="mb-3">
        <Form.Label>Sort By</Form.Label>
        <Form.Control
          className="w-25"
          as="select"
          value={sortField}
          onChange={(e) => onSortChange(e.target.value, sortOrder)}
        >
          <option value="">None</option>
          <option value="paperTitle">Paper Title</option>
          <option value="authors.0">First Author</option>
          <option value="styleSpecific.tags">Tags</option>
          <option value="journal.journalName">Journal Name</option>
          <option value="journal.impactFactor">Journal Impact Factor</option>
          {/* Add more sorting options as needed */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="sortOrder">
        <Form.Label>Sort Order</Form.Label>
        <Form.Control
          className="w-25"
          as="select"
          value={sortOrder}
          onChange={(e) => onSortChange(sortField, e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );
};

export default SortForm;
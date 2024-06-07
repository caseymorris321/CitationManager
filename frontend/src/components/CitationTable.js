import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useCitationsContext } from '../hooks/useCitationsContext';

const CitationTable = ({ citations, onFavoriteClick }) => {
  const { favorites } = useCitationsContext();

  const isFavorite = (citationId) => {
    return favorites.includes(citationId);
  };

  return (
    <div className='position-relative'>
      <Table className='table-borderless' striped hover>
        <thead className='border-bottom border-dark'>
          <tr>
            <th scope="row" className='p-3'></th>
            <th>Title</th>
            <th>First Author</th>
            <th>Tags</th>
            <th>Journal Name</th>
          </tr>
        </thead>
        <tbody className='align-middle'>
          {citations.map((citation, index) => (
            <tr key={citation._id || index}>
              <td className='align-middle'>
                <div role="button" onClick={() => onFavoriteClick(citation._id)}>
                  {isFavorite(citation._id) ? <FaStar className="text-dark" /> : <FaRegStar />}
                </div>
              </td>
              <td className='user-select-all'>
                <Link to={`/citations/${citation._id}`}>{citation.paperTitle || ''}</Link>
              </td>
              <td className='user-select-all'>{citation.authors && citation.authors.length > 0 ? citation.authors[0] : ''}</td>
              <td className='user-select-all'>{citation.styleSpecific?.tags?.join(', ') || ''}</td>
              <td className='user-select-all'>{citation.journal?.journalName || ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CitationTable;
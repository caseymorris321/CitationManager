import { useState } from 'react';
import { useCitationsContext } from '../hooks/useCitationsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Button, Card } from 'react-bootstrap';

const CitationDetails = ({ citation }) => {
  const { dispatch } = useCitationsContext();
  const { user } = useAuthContext();
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this citation?');
    if (confirmDelete) {
      const response = await fetch('/api/citations/' + citation._id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ isDeleted: true }),
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: 'MARK_CITATION_DELETED', payload: json });
        setIsDeleted(true);
      }
    }
  };

  const handleUndo = async () => {
    const response = await fetch('/api/citations/' + citation._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ isDeleted: false }),
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'UNDO_DELETE_CITATION', payload: json });
      setIsDeleted(false);
    }
  };

  // Helper function to render style-specific data if available
  const renderStyleSpecificData = () => {
    if (!citation.styleSpecific) return null;
    return Object.entries(citation.styleSpecific).map(([key, value]) => (
      <p key={key}>
        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </strong>
        {value.toString()}
      </p>
    ));
  };

  const formatCitation = (citation) => {
    const JournalName = ({ name }) => <span style={{ fontStyle: 'italic' }}>{name}</span>;

    const { authors, paperTitle, journal, publicationDate, DOI } = citation;
    let authorStr = authors.join(', ');
    if (authors.length > 3) {
      authorStr = `${authors[0]}, et al.`;
    }
    const year = publicationDate ? new Date(publicationDate).getFullYear() : '';
    const volume = journal?.volume ? `${journal.volume}` : '';
    const issue = journal?.issue ? `(${journal.issue})` : '';
    const pages = journal?.pages ? `:${journal.pages}` : '';
    const journalName = journal?.journalName ? <JournalName name={journal.journalName} /> : '';
    const doiPart = DOI ? `DOI: ${DOI}` : '';

    switch (citation.citationStyle) {
      case 'CSE':
        return (
          <>
            {`${authorStr} (${year}). ${paperTitle}. `}
            {journalName}.
            {` ${volume}${issue}${pages}. ${doiPart}`}
          </>
        );
      case 'APA':

      case 'MLA':

      default:
        return '';
    }
  };

  const formatJournalDetails = () => {
    const { journal } = citation;
    if (!journal) return '';

    const { volume, issue, pages } = journal;
    const volumeDisplay = volume || '';
    const issueDisplay = issue ? issue : (volume || pages) ? '-' : '';
    const pagesDisplay = pages || '';

    if (!volumeDisplay && !issueDisplay && !pagesDisplay) {
      return '';
    }

    return `${volumeDisplay}/${issueDisplay}/${pagesDisplay}`;
  };

  // Convert publicationDate to a Date object
  const publicationDate = new Date(citation.publicationDate);

  if (isDeleted) {
    return (
      <Card className="mt-4 mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Text>Citation deleted.</Card.Text>
            <Button variant="outline-secondary" onClick={handleUndo}>
              Undo
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-4 mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">{citation.paperTitle}</Card.Title>
          <Button variant="outline-danger" onClick={handleDelete}>Delete</Button>
        </div>
        <Card.Text>
          <strong>Authors: </strong>{citation.authors.join(', ')}
        </Card.Text>
        <Card.Text>
          <strong>Journal Name: </strong>{citation.journal?.journalName}
        </Card.Text>
        <Card.Text className='ms-3'>
          <strong>Volume/Issue/Pages: </strong>{formatJournalDetails()}
        </Card.Text>
        <Card.Text className='ms-3'>
          <strong>Journal Impact Factor: </strong>{citation.journal?.impactFactor}
        </Card.Text>
        <Card.Text className='ms-3'>
          <strong>Journal Tags: </strong>{citation.journal?.tags?.join(', ')}
        </Card.Text>
        <Card.Text>
          <strong>Publication Year: </strong>{publicationDate.getFullYear()}
        </Card.Text>
        <Card.Text>
          <strong>Publisher Location: </strong>{citation.publisherLocation}
        </Card.Text>
        <Card.Text>
          <strong>DOI: </strong>{citation.DOI}
        </Card.Text>

        {renderStyleSpecificData()}
        <Card.Text>
          <strong>Comments: </strong>{citation.comments}
        </Card.Text>
        <Card.Text>
          <strong>Citation Style: </strong>{citation.citationStyle}
        </Card.Text>
        <Card.Text><strong>Formatted Citation:</strong> {formatCitation(citation)}</Card.Text>
      </Card.Body>
    </Card>
  );
};
export default CitationDetails;
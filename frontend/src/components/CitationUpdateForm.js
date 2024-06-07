import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const CitationUpdateForm = ({ citation, onUpdate, onCancel }) => {
  const { user } = useAuthContext();

  const [selectedStyle, setSelectedStyle] = useState(citation.citationStyle);
  const [paperTitle, setPaperTitle] = useState(citation.paperTitle);
  const [authors, setAuthors] = useState(citation.authors.join(', '));
  const [journalName, setJournalName] = useState(citation.journal?.journalName || '');
  const [journalVolume, setJournalVolume] = useState(citation.journal?.volume || '');
  const [journalIssue, setJournalIssue] = useState(citation.journal?.issue || '');
  const [journalPageStart, setJournalPageStart] = useState(citation.journal?.pages?.split('-')[0] || '');
  const [journalPageEnd, setJournalPageEnd] = useState(citation.journal?.pages?.split('-')[1] || '');
  const [journalImpactFactor, setJournalImpactFactor] = useState(citation.journal?.impactFactor || '');
  const [journalTags, setJournalTags] = useState(citation.journal?.tags?.join(', ') || '');
  const [publicationYear, setPublicationYear] = useState(new Date(citation.publicationDate).getUTCFullYear());
  const [publicationDate, setPublicationDate] = useState(citation.publicationDate);
  const [publisherLocation, setPublisherLocation] = useState(citation.publisherLocation);
  const [DOI, setDOI] = useState(citation.DOI);
  const [comments, setComments] = useState(citation.comments);
  const [methods, setMethods] = useState(citation.styleSpecific?.methods || '');
  const [observations, setObservations] = useState(citation.styleSpecific?.observations || '');
  const [annotation, setAnnotation] = useState(citation.styleSpecific?.annotation || '');
  const [tags, setTags] = useState(citation.styleSpecific?.tags?.join(', ') || '');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const journal = {
      journalName: journalName,
      volume: journalVolume,
      issue: journalIssue,
      pages: journalPageStart && journalPageEnd ? `${journalPageStart}-${journalPageEnd}` : journalPageStart || journalPageEnd,
      impactFactor: journalImpactFactor,
      tags: journalTags.split(',').filter(tag => tag.trim() !== ''),
    };

    const updatedCitation = {
      authors: authors.split(',').map(author => author.trim()),
      paperTitle,
      journal,
      publicationYear,
      publicationDate: new Date(publicationYear, 0, 1).toISOString(),
      publisherLocation,
      DOI,
      citationStyle: selectedStyle,
      comments,
      styleSpecific: selectedStyle === 'CSE' ? {
        methods,
        observations,
        annotation,
        tags: tags.split(',').map(tag => tag.trim())
      } : null
    };

    onUpdate(updatedCitation);
  };

  return (
    <Container fluid className="mb-3">
      <Form onSubmit={handleSubmit} className="mt-3">
        <h3>Update Citation</h3>
        <Form.Group className="mb-3">
          <Form.Label>Citation Style:</Form.Label>
          <Form.Control as="select" value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)}>
            <option value="">Select Style</option>
            <option value="CSE">CSE</option>
            <option value="APA">APA</option>
            <option value="MLA">MLA</option>
            <option value="IEEE">IEEE</option>
            <option value="Chicago">Chicago</option>
            <option value="Harvard">Harvard</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Paper Title:</Form.Label>
          <Form.Control type="text" value={paperTitle} onChange={e => setPaperTitle(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Authors (comma separated):</Form.Label>
          <Form.Control type="text" value={authors} onChange={e => setAuthors(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Journal Name:</Form.Label>
          <Form.Control type="text" value={journalName} onChange={e => setJournalName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Journal Volume:</Form.Label>
          <Form.Control type="text" value={journalVolume} onChange={e => setJournalVolume(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Journal Issue:</Form.Label>
          <Form.Control type="text" value={journalIssue} onChange={e => setJournalIssue(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Journal Page Start:</Form.Label>
          <Form.Control type="text" value={journalPageStart} onChange={e => setJournalPageStart(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Journal Page End:</Form.Label>
          <Form.Control type="text" value={journalPageEnd} onChange={e => setJournalPageEnd(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Journal Impact Factor:</Form.Label>
          <Form.Control type="text" value={journalImpactFactor} onChange={e => setJournalImpactFactor(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Journal Tags (comma separated):</Form.Label>
          <Form.Control type="text" value={journalTags} onChange={e => setJournalTags(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Publication Year:</Form.Label>
          <Form.Control
            type="number"
            min="1900"
            max={new Date().getUTCFullYear()}
            value={publicationYear}
            onChange={e => setPublicationYear(parseInt(e.target.value, 10))}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Publication Date (replaces year):</Form.Label>
          <Form.Control type="date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Publisher Location:</Form.Label>
          <Form.Control type="text" value={publisherLocation} onChange={e => setPublisherLocation(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>DOI:</Form.Label>
          <Form.Control type="text" value={DOI} onChange={e => setDOI(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Comments:</Form.Label>
          <Form.Control as="textarea" value={comments} onChange={e => setComments(e.target.value)} />
        </Form.Group>

        {selectedStyle === 'CSE' && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Methods:</Form.Label>
              <Form.Control as="textarea" value={methods} onChange={e => setMethods(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observations:</Form.Label>
              <Form.Control as="textarea" value={observations} onChange={e => setObservations(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Annotation:</Form.Label>
              <Form.Control as="textarea" value={annotation} onChange={e => setAnnotation(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated):</Form.Label>
              <Form.Control type="text" value={tags} onChange={e => setTags(e.target.value)} />
            </Form.Group>
          </>
        )}

        <Button type="submit" variant="primary">Update Citation</Button>
        <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      </Form>
    </Container>
  );
};

export default CitationUpdateForm;

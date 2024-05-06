import { useState } from "react";
import { useCitationsContext } from "../hooks/useCitationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Form, Button, Container, Alert } from 'react-bootstrap';



const CitationForm = () => {
  const { dispatch } = useCitationsContext();
  const { user } = useAuthContext();

  const [selectedStyle, setSelectedStyle] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journalName, setJournalName] = useState('');
  const [journalVolume, setJournalVolume] = useState('');
  const [journalIssue, setJournalIssue] = useState('');
  const [journalPageStart, setJournalPageStart] = useState('');
  const [journalPageEnd, setJournalPageEnd] = useState('');
  const [journalImpactFactor, setJournalImpactFactor] = useState('');
  const [journalTags, setJournalTags] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [publisherLocation, setPublisherLocation] = useState('');
  const [DOI, setDOI] = useState('');
  const [comments, setComments] = useState('');
  const [methods, setMethods] = useState('');
  const [observations, setObservations] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in')
      return
    }

    const journal = {
      journalName: journalName,
      volume: journalVolume,
      issue: journalIssue,
      pages: journalPageStart && journalPageEnd ? `${journalPageStart}-${journalPageEnd}` : journalPageStart || journalPageEnd,
      impactFactor: journalImpactFactor,
      tags: journalTags.split(',').filter(tag => tag.trim() !== '') // Ensure only non-empty strings are included
    };

    const citation = {
      authors: authors.split(',').map(author => author.trim()),
      paperTitle,
      journal,
      publicationDate: publicationDate || `${publicationYear}-01-01`,
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

    const response = await fetch('/api/citations', {
      method: 'POST',
      body: JSON.stringify(citation),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    }

    if (response.ok) {
      setPaperTitle('');
      setAuthors('');
      setJournalName('');
      setJournalVolume('');
      setJournalIssue('');
      setJournalPageStart('');
      setJournalPageEnd('');
      setJournalImpactFactor('');
      setJournalTags('');
      setPublicationYear('');
      setPublicationDate('');
      setPublisherLocation('');
      setDOI('');
      setComments('');
      setMethods('');
      setObservations('');
      setAnnotation('');
      setTags('');
      setSelectedStyle('');
      setError(null);
      setEmptyFields([]);
      console.log('new citation added', json);
      dispatch({ type: 'CREATE_CITATION', payload: json });
    }
  };

  return (
    <Container fluid className="mb-3">
      <Form onSubmit={handleSubmit} className="mt-3">
        <h3>Add a New Citation</h3>
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

        {selectedStyle && (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="required">Paper Title:</Form.Label>
              <Form.Control type="text" value={paperTitle} onChange={e => setPaperTitle(e.target.value)} className={emptyFields.includes('paperTitle') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="required">Authors (comma separated):</Form.Label>
              <Form.Control type="text" value={authors} onChange={e => setAuthors(e.target.value)} className={emptyFields.includes('authors') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="required">Journal Name:</Form.Label>
              <Form.Control type="text" value={journalName} onChange={e => setJournalName(e.target.value)} className={emptyFields.includes('journalName') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Journal Volume:</Form.Label>
              <Form.Control type="text" value={journalVolume} onChange={e => setJournalVolume(e.target.value)} className={emptyFields.includes('journalVolume') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Journal Issue:</Form.Label>
              <Form.Control type="text" value={journalIssue} onChange={e => setJournalIssue(e.target.value)} className={emptyFields.includes('journalIssue') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Journal Page Start:</Form.Label>
              <Form.Control type="text" value={journalPageStart} onChange={e => setJournalPageStart(e.target.value)} className={emptyFields.includes('journalPageStart') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Journal Page End:</Form.Label>
              <Form.Control type="text" value={journalPageEnd} onChange={e => setJournalPageEnd(e.target.value)} className={emptyFields.includes('journalPageEnd') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Journal Impact Factor:</Form.Label>
              <Form.Control type="text" value={journalImpactFactor} onChange={e => setJournalImpactFactor(e.target.value)} className={emptyFields.includes('journalImpactFactor') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Journal Tags (comma separated):</Form.Label>
              <Form.Control type="text" value={journalTags} onChange={e => setJournalTags(e.target.value)} className={emptyFields.includes('journalTags') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="required">Publication Year:</Form.Label>
              <Form.Control type="number" min="1900" max={new Date().getFullYear()} value={publicationYear} onChange={e => setPublicationYear(e.target.value)} className={emptyFields.includes('publicationYear') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Publication Date (replaces year):</Form.Label>
              <Form.Control type="date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} className={emptyFields.includes('publicationDate') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Publisher Location:</Form.Label>
              <Form.Control type="text" value={publisherLocation} onChange={e => setPublisherLocation(e.target.value)} className={emptyFields.includes('publisherLocation') ? 'error' : ''} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="required">DOI:</Form.Label>
              <Form.Control type="text" value={DOI} onChange={e => setDOI(e.target.value)} className={emptyFields.includes('DOI') ? 'error' : ''} />
            </Form.Group>

            {selectedStyle === 'CSE' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Methods:</Form.Label>
                  <Form.Control as="textarea" value={methods} onChange={e => setMethods(e.target.value)} className={emptyFields.includes('methods') ? 'error' : ''} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Observations:</Form.Label>
                  <Form.Control as="textarea" value={observations} onChange={e => setObservations(e.target.value)} className={emptyFields.includes('observations') ? 'error' : ''} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Annotation:</Form.Label>
                  <Form.Control as="textarea" value={annotation} onChange={e => setAnnotation(e.target.value)} className={emptyFields.includes('annotation') ? 'error' : ''} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma separated):</Form.Label>
                  <Form.Control type="text" value={tags} onChange={e => setTags(e.target.value)} className={emptyFields.includes('tags') ? 'error' : ''} />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Comments:</Form.Label>
              <Form.Control as="textarea" value={comments} onChange={e => setComments(e.target.value)} className={emptyFields.includes('comments') ? 'error' : ''} />
            </Form.Group>

            <Button type="submit" variant="primary">Add Citation</Button>
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}

          </>
        )}
      </Form>
    </Container>
  );
};


export default CitationForm;
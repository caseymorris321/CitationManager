import { useEffect, useState } from "react";
import { useCitationsContext } from "../hooks/useCitationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CitationForm from "../components/CitationForm";
import SearchForm from "../components/SearchForm";
import SortForm from "../components/SortForm";
import CitationTable from "../components/CitationTable";
import SearchHistory from "../components/SearchHistory";
import { Button, Row, Col } from "react-bootstrap";
import { sortCitations } from "../utils/sort";

const baseUrl = 'https://citationmanagerbackend.onrender.com';

const Home = () => {
  const { citations, favorites, dispatch } = useCitationsContext();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [newSearchQuery, setNewSearchQuery] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/citations`, {
          headers: {
            Authorization: `Bearer ${user ? user.token : ""}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: "SET_CITATIONS", payload: json });

          // Initialize favorites based on the isFavorite property
          const favorites = json
            .filter((citation) => citation.isFavorite)
            .map((citation) => citation._id);
          dispatch({ type: "SET_FAVORITES", payload: favorites });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [dispatch, user]);

  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };


  const handleFavoriteClick = async (citationId) => {
    try {
      if (user) {
        const citation = citations.find((c) => c._id === citationId);
        const isFavorite = citation.isFavorite;

        let response;

        if (isFavorite) {
          // Remove the citation from favorites
          response = await fetch(`${baseUrl}/api/favorites/${citationId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
        } else {
          // Add the citation to favorites
          response = await fetch(`${baseUrl}/api/favorites/${citationId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
          });
        }

        if (response.ok) {
          // Update the favorite status in the local state
          const updatedCitations = citations.map((c) =>
            c._id === citationId ? { ...c, isFavorite: !isFavorite } : c
          );
          dispatch({ type: 'SET_CITATIONS', payload: updatedCitations });

          const updatedFavorites = isFavorite
            ? favorites.filter(id => id !== citationId)
            : [...favorites, citationId];
          dispatch({ type: 'SET_FAVORITES', payload: updatedFavorites });
        } else {
          console.error('Failed to update favorite status');
        }
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
  };

  const handleGoBack = () => {
    setShowFavorites(false);
  };

  const handleNewSearchQuery = () => {
    setNewSearchQuery(new Date());
  };

  const sortedCitations = sortField ? sortCitations(citations, sortField, sortOrder) : citations;

  const displayedCitations = showFavorites
    ? sortedCitations.filter((citation) => favorites.includes(citation._id))
    : sortedCitations;

    return (
      <div className="container">
        <Row>
          <Col xs={12} className="mb-3">
            <Button variant="primary" onClick={toggleSearchForm} className="me-2">
              {showSearchForm ? 'Hide Search' : 'Search'}
            </Button>
            <Button variant="primary" onClick={toggleSortOptions}>
              {showSortOptions ? 'Hide Sort' : 'Sort'}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
          {showSearchForm && <SearchForm onNewSearchQuery={handleNewSearchQuery} />}

            {showSortOptions && (
              <div className={`mt-3 ${showSearchForm ? '' : 'mt-0'}`}>
                <SortForm
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              </div>
            )}
          </Col>
          <Col md={3}>
          {showSearchForm && <SearchHistory timestamp={newSearchQuery} />}
          </Col>
        </Row>
        <Row>
          <Col md={9} className="order-2 order-md-1">
            <div className="text-center">
              <h2>Citations</h2>
              {isLoading ? (
                <p>Loading citations...</p>
              ) : (
                <>
                  {user && (
                    <Button className='mb-3' variant="primary" onClick={handleShowFavorites}>
                      Show Favorites
                    </Button>
                  )}
                  <CitationTable
                    citations={displayedCitations}
                    onFavoriteClick={handleFavoriteClick}
                    favorites={favorites}
                  />
                  {showFavorites && (
                    <Button variant="secondary" onClick={handleGoBack}>
                      Back
                    </Button>
                  )}
                </>
              )}
            </div>
          </Col>
          <Col md={3} className="order-1 order-md-2">
            <CitationForm />
          </Col>
        </Row>
      </div>
    );
  };
  
  export default Home;
// CitationDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import CitationDetails from '../components/CitationDetails';
import { Button } from 'react-bootstrap';
import { useCitationsContext } from "../hooks/useCitationsContext";

const baseUrl = 'https://citationmanagerbackend.onrender.com';

const CitationDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const { dispatch } = useCitationsContext();
    const [citation, setCitation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCitation = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/citations/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCitation(data);
                } else {
                    console.error('Failed to fetch citation');
                }
            } catch (error) {
                console.error('Error fetching citation:', error);
            }
        };

        if (user) {
            fetchCitation();
        }
    }, [id, user]);

    const handleGoBack = () => {
        navigate("/");
    };

    const handleFavoriteClick = async () => {
        if (user) {
            const method = citation.isFavorite ? "DELETE" : "POST";
            try {
                const response = await fetch(`${baseUrl}/api/favorites/${id}`, {
                    method: method,
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    setCitation({ ...citation, isFavorite: !citation.isFavorite });
                    const actionType = citation.isFavorite ? "REMOVE_FAVORITE" : "SET_FAVORITE";
                    dispatch({ type: actionType, payload: id });
                } else {
                    console.error("Failed to update favorite status");
                }
            } catch (error) {
                console.error("Error updating favorite status:", error);
            }
        }
    };

    return (
        <div className="container">
            <h2>Citation Details</h2>
            {citation && (
                <CitationDetails
                    citation={citation}
                    onFavoriteClick={handleFavoriteClick}
                    setCitation={setCitation}
                />
            )}
            <Button variant="primary" onClick={handleGoBack} className="mb-3">
                Back to Citations
            </Button>
        </div>
    );
};

export default CitationDetailsPage;
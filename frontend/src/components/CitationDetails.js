import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useCitationsContext } from "../hooks/useCitationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button, Card } from "react-bootstrap";
import CitationUpdateForm from "./CitationUpdateForm";
import formatCitation from "../utils/citationFormatters/formatCitation";

const CitationDetails = ({ citation, onFavoriteClick, setCitation }) => {
  const { citations, dispatch } = useCitationsContext();
  const { user } = useAuthContext();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentCitation, setCurrentCitation] = useState(citation);


  if (!citation) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async (updatedCitation) => {
    if (!user) {
      return;
    }

    const response = await fetch(`/api/citations/${citation._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatedCitation),
    });
  
    const json = await response.json();
    if (response.ok) {
      // Update the citations state directly
      dispatch({ 
        type: "SET_CITATIONS", 
        payload: citations.map(c => c._id === json._id ? json : c)
      });
      setIsUpdating(false);
      setCitation(json);
    } else {
      alert("Failed to update citation");
    }
  };

  const handlePartialUpdate = async (field, value) => {
    if (!user) {
      return;
    }

    let partialUpdate;

    if (field === "publicationDate") {
      const year = parseInt(value, 10);
      if (isNaN(year) || year < 1000 || year > 9999) {
        alert("Invalid publication year. Please enter a valid year.");
        return;
      }
      partialUpdate = { [field]: `${year}-01-01` };
    } else if (field.startsWith("journal.")) {
      // Handle nested journal fields
      const journalField = field.split(".")[1];
      partialUpdate = {
        journal: {
          ...citation.journal,
          [journalField]: value,
        },
      };
    } else if (field.startsWith("styleSpecific.")) {
      // Handle nested styleSpecific fields
      const styleSpecificField = field.split(".")[1];
      partialUpdate = {
        styleSpecific: {
          ...citation.styleSpecific,
          [styleSpecificField]: value,
        },
      };
    } else {
      partialUpdate = { [field]: value };
    }

    const response = await fetch(`/api/citations/${citation._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ ...citation, ...partialUpdate }),
    });
    
    const json = await response.json();
    console.log("Server response:", json); // Add this line to inspect the response
    
    if (response.ok) {
      // Update the citations state directly
      dispatch({ 
        type: "SET_CITATIONS", 
        payload: citations.map(c => c._id === json._id ? json : c)
      });
      setCitation(json);
    } else {
      alert("Failed to update citation");
    }
  };

  const handleDoubleClick = (field) => {
    let value;
    switch (field) {
      case "authors":
      case "tags":
        value = prompt(`Enter new ${field} (comma-separated)`);
        if (value) {
          handlePartialUpdate(
            field,
            value.split(",").map((item) => item.trim())
          );
        }
        break;
      case "journal.journalName":
        value = prompt("Enter new journal name");
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
      case "journal.volume":
        value = prompt("Enter new volume");
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
      case "journal.issue":
        value = prompt("Enter new issue");
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
      case "journal.impactFactor":
        value = prompt("Enter new impact factor");
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
      case "journal.tags":
        value = prompt("Enter new journal tags (comma-separated)");
        if (value) {
          handlePartialUpdate(
            field,
            value.split(",").map((item) => item.trim())
          );
        }
        break;
      case "styleSpecific.methods":
        value = prompt("Enter new methods");
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
      case "styleSpecific.observations":
        value = prompt("Enter new observations");
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
      case "styleSpecific.annotation":
        value = prompt("Enter new annotation");
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
      case "styleSpecific.tags":
        value = prompt("Enter new tags (comma-separated)");
        if (value) {
          handlePartialUpdate(
            field,
            value.split(",").map((item) => item.trim())
          );
        }
        break;
      case "journal.pages":
        const startPage = prompt("Enter start page");
        const endPage = prompt("Enter end page");
        if (startPage && endPage) {
          value = `${startPage}-${endPage}`;
          handlePartialUpdate(field, value);
        }
        break;
      case "publicationYear":
        value = prompt("Enter new publication year");
        if (value) {
          const year = parseInt(value, 10);
          const currentYear = new Date().getFullYear();
          if (isNaN(year) || year < 1000 || year > currentYear) {
            alert("Invalid publication year. Please enter a valid year.");
            return;
          }
          handlePartialUpdate("publicationDate", `${year}-01'01`);
        }
        break;
      default:
        value = prompt(`Enter new ${field}`);
        if (value) {
          handlePartialUpdate(field, value);
        }
        break;
    }
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }
  
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this citation?"
    );
    if (confirmDelete) {
      const response = await fetch(`/api/citations/${citation._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (response.ok) {
        dispatch({ type: "DELETE_CITATION", payload: citation._id });
        setIsDeleted(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete citation:", errorData);
        alert("Failed to delete citation. Please try again.");
      }
    }
  };

  const handleUndo = async () => {
    if (!user) {
      return;
    }
  
    const response = await fetch(`/api/citations/${citation._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ isDeleted: false }),
    });
  
    if (response.ok) {
      const updatedCitation = await response.json();
      dispatch({ type: "UNDO_DELETE_CITATION", payload: updatedCitation });
      setIsDeleted(false);
    } else {
      const errorData = await response.json();
      console.error("Failed to undo citation deletion:", errorData);
      alert("Failed to undo citation deletion. Please try again.");
    }
  };

  

  const renderCitationField = (field, label) => {
    let value;
    if (field === "publicationYear") {
      value = citation.publicationDate
        ? citation.publicationDate.substring(0, 4)
        : "";
    } else if (field.startsWith("journal.")) {
      const journalField = field.split(".")[1];
      value = citation.journal?.[journalField];
    } else if (field.startsWith("styleSpecific.")) {
      const styleSpecificField = field.split(".")[1];
      value = citation.styleSpecific?.[styleSpecificField];
    } else {
      value = citation[field];
    }
    return (
      <Card.Text onDoubleClick={() => handleDoubleClick(field)}>
        <strong>{label}: </strong>
        {Array.isArray(value) ? value.join(", ") : value}
      </Card.Text>
    );
  };

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
        <div className="position-relative">
          <div className="d-flex justify-content-end mb-2 align-center">
            <div className="d-flex align-items-center">
              {citation.isFavorite ? (
                <FaStar
                  onClick={onFavoriteClick}
                  role="button"
                  className="text-dark me-3"
                />
              ) : (
                <FaRegStar
                  onClick={onFavoriteClick}
                  role="button"
                  className="text-dark me-3"
                />
              )}
              <div>
                <Button
                  variant="outline-primary"
                  onClick={() => setIsUpdating(true)}
                  className="me-2"
                >
                  Update
                </Button>
                <Button variant="outline-danger" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
          {isUpdating ? (
            <CitationUpdateForm
              citation={citation}
              onUpdate={handleUpdate}
              onCancel={() => setIsUpdating(false)}
            />
          ) : (
            <>
              {renderCitationField("paperTitle", "title")}
              {renderCitationField("authors", "Authors")}
              {renderCitationField("journal.journalName", "Journal Name")}
              <div className="ms-3 mb-3">
                {renderCitationField("journal.volume", "Volume")}
                {renderCitationField("journal.issue", "Issue")}
                {renderCitationField("journal.pages", "Pages")}
                {renderCitationField("journal.impactFactor", "Impact Factor")}
                {renderCitationField("journal.tags", "Journal Tags")}
              </div>
              {renderCitationField("publicationYear", "Publication Year")}
              {renderCitationField("publisherLocation", "Publisher Location")}
              {renderCitationField("DOI", "DOI")}
              {renderCitationField("comments", "Comments")}
              {citation.citationStyle === "CSE" && (
                <>
                  {renderCitationField("styleSpecific.methods", "Methods")}
                  {renderCitationField("styleSpecific.observations", "Observations")}
                  {renderCitationField("styleSpecific.annotation", "Annotation")}
                  {renderCitationField("styleSpecific.tags", "Tags")}
                </>
              )}
              <Card.Text>
                <strong>Citation Style: </strong>{citation.citationStyle}
              </Card.Text>
              <strong>Formatted Citation:</strong>  <Card.Text className='user-select-all'>{formatCitation(citation)}</Card.Text>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};


export default CitationDetails;
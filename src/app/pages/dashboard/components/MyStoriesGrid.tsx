import React, { useState, useEffect } from 'react';
import { getStoriesByOwner } from '../../../modules/auth/core/_requests';
import { StoryDetails } from '../../../modules/auth/core/_models';

const MyStoriesGrid: React.FC = () => {
  const [myStories, setMyStories] = useState<StoryDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const storiesPerPage = 3;

  // Λήψη ιστοριών χρήστη
  const loadMyStories = async () => {
    try {
      const authToken = 'mock-auth-token'; // Αντικατέστησέ το με το πραγματικό token του χρήστη
      const response = await getStoriesByOwner(authToken, currentPage, storiesPerPage);
      const { content, totalPages: total } = response.data;

      setMyStories(content);
      setTotalPages(total);
    } catch (error) {
      console.error('Error fetching user stories:', error);
    }
  };

  useEffect(() => {
    loadMyStories();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Inline styles για το grid
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'left',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  };

  const storyTitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    marginBottom: '0',
  };

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#009ef7',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s, transform 0.2s',
    outline: 'none',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#c4c4c4',
    cursor: 'not-allowed',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>My Stories</h2>
      {myStories.length > 0 ? (
        <>
          <div style={gridStyle}>
            {myStories.map((story) => (
              <div key={story.id}>
                <img
                  src={story.cover || 'default-image.png'}
                  alt={story.title}
                  style={imageStyle}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <p style={storyTitleStyle}>{story.title}</p>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div style={paginationStyle}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              style={currentPage === 0 ? disabledButtonStyle : buttonStyle}
            >
              Previous
            </button>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              style={currentPage === totalPages - 1 ? disabledButtonStyle : buttonStyle}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p style={{ fontSize: '18px', color: '#666' }}>
          You don't have any stories yet. Start creating your first story!
        </p>
      )}
    </div>
  );
};

export { MyStoriesGrid };

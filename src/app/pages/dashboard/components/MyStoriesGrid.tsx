import React, { useState, useCallback, useEffect } from 'react';
import { getStoriesByOwner, getStoryDetails } from '../../../modules/auth/core/_requests';
import { StoryDetails } from '../../../modules/auth/core/_models';
import { Modal } from '../../../modules/auth/components/Modal';
import { useIntl } from 'react-intl'
import {getAuth} from '../../../modules/auth/core/AuthHelpers';

const MyStoriesGrid: React.FC = () => {
  const intl = useIntl();
  const [myStories, setMyStories] = useState<StoryDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const storiesPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false); // Διαχείριση του modal
  const [selectedStory, setSelectedStory] = useState<StoryDetails | null>(null); // Επιλεγμένη ιστορία

  // Λήψη ιστοριών χρήστη
  // Wrap loadMyStories with useCallback
  const loadMyStories = useCallback(async () => {
    try {
      const auth = getAuth();
      if (!auth) {
        console.error('No auth token found');
        return;
      }
      const response = await getStoriesByOwner(auth.token, currentPage, storiesPerPage);
      const { content, totalPages: total } = response.data;

      setMyStories(content);
      setTotalPages(total);
    } catch (error) {
      console.error('Error fetching user stories:', error);
    }
  }, [currentPage, storiesPerPage]); // Add dependencies used inside the function

  // Call loadMyStories in useEffect
  useEffect(() => {
    loadMyStories();
  }, [loadMyStories]);

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

  const openModal = async (storyId: number) => {
    try {
      const auth = getAuth();
      if (!auth) {
        console.error('No auth token found');
        return;
      }
      const response = await getStoryDetails(storyId, auth.token); // Λήψη λεπτομερειών ιστορίας
      setSelectedStory(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching story details:', error);
    }
  };

  const closeModal = () => {
    setSelectedStory(null);
    setIsModalOpen(false);
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

  const gridItemStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9', // Ανοιχτό γκρι χρώμα
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    display: 'flex', // Ευθυγράμμιση περιεχομένων
    flexDirection: 'column',
    justifyContent: 'space-between', // Στοιχίσεις των στοιχείων
    height: '100%', // Ισοσταθμισμένο ύψος
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  };
  
  const imageStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '8px',
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
      <h2 style={titleStyle}>{intl.formatMessage({ id: 'MyStoriesGrid.MyStories' })}</h2>
      {myStories.length > 0 ? (
        <>
          <div style={gridStyle}>
            {myStories.map((story) => (
              <div key={story.id} style={gridItemStyle}
                onClick={() => openModal(story.id)} // Άνοιγμα του Modal
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                <img
                  src={story.cover || 'default-image.png'}
                  alt={story.title}
                  style={imageStyle}
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
              {intl.formatMessage({ id: 'Previous' })}
            </button>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'Page' })} {currentPage + 1} {intl.formatMessage({ id: 'of' })} {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              style={currentPage === totalPages - 1 ? disabledButtonStyle : buttonStyle}
            >
              {intl.formatMessage({ id: 'Next' })}
            </button>
          </div>
        </>
      ) : (
        <p style={{ fontSize: '18px', color: '#666' }}>
          {intl.formatMessage({ id: 'MyStoriesGrid.Youdonthaveanystoriesyet.Startcreatingyourfirststory' })}
        </p>
      )}
      {/* Modal */}
      {selectedStory && (
        <Modal
          isOpen={isModalOpen}
          showPrintButton={false}
          onClose={closeModal}
          storyDetails={selectedStory}
        />
      )}
    </div>
  );
};

export { MyStoriesGrid };

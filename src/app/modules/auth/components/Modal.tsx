import React, { useState, useRef, useEffect } from 'react';
import { StoryDetails, UserModel } from '../core/_models';
// Define the type for images, including language, level, and age
// interface Image {
//   id: number;
//   src: string;
//   alt: string;
//   title: string;
//   language: string;
//   level: string;
//   age: string; // New property for age filter
//   text: string | null;
// }
import { useIntl } from 'react-intl'
import StarRatings from 'react-star-ratings';

interface ModalProps {
  isOpen: boolean;
  showPrintButton: boolean;
  onClose: () => void;
  onDelete?: () => void; // Νέο prop για διαγραφή
  onRate?: (rating: number) => void; // Νέο prop για rating
  currentUser?: UserModel;
  // selectedStory: Image | null;
  storyDetails: StoryDetails;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, showPrintButton, onClose, onDelete, onRate, currentUser, storyDetails }) => {
  const intl = useIntl();
  const printRef = useRef<HTMLDivElement>(null); // Χρησιμοποιούμε ref για επιλεκτική εκτύπωση
  const [userRating, setUserRating] = useState(storyDetails.rate);

  useEffect(() => {
    setUserRating(storyDetails.rate);
  }, [storyDetails]);
  
  if (!isOpen || !storyDetails) return null;

  const handleRatingChange = (newRating: number) => {
    setUserRating(newRating);
    if (onRate) {
      onRate(newRating); // Καλούμε τη συνάρτηση onRate αν υπάρχει
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
                  <html>
                      <head>
                          <title>Print Story Details</title>
                          <style>
                              body { font-family: Arial, sans-serif; margin: 20px; }
                              img { max-width: 100%; height: auto; }
                              .print-container { text-align: center; }
                          </style>
                      </head>
                      <body>
                          <div class="print-container">${printContent}</div>
                      </body>
                  </html>
              `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    width: '80%',
    maxWidth: '800px',
    maxHeight: '90%',
    overflowY: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 στήλες
    gap: '20px',
    marginTop: '20px',
  };

  const itemStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: '10px',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#555',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between', // Τοποθέτηση Close και Print
    alignItems: 'center',
    marginTop: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    color: '#fff',
  };

  const closeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#ff5c5c',
  };

  const printButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
  };

  const deleteButtonStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#d9534f', // Κόκκινο για διαγραφή
    color: '#fff',
  };

  // Δημιουργούμε έναν πίνακα με εικόνες και τα αντίστοιχα κείμενα
  const imagesWithTexts: ({ src: string | null; id: number; text: string | null } | { src: string | null; id: number; text: string | null } | { src: string | null; id: number; text: string | null } | { src: string | null; id: number; text: string | null } | { src: string | null; id: number; text: string | null } | { src: string | null; id: number; text: string | null } | { src: string | null; id: number; text: string | null })[] = [
    { id: 1, src: storyDetails.image1, text: storyDetails.text1 },
    { id: 2, src: storyDetails.image2, text: storyDetails.text2 },
    { id: 3, src: storyDetails.image3, text: storyDetails.text3 },
    { id: 4, src: storyDetails.image4, text: storyDetails.text4 },
    { id: 5, src: storyDetails.image5, text: storyDetails.text5 },
    { id: 6, src: storyDetails.image6, text: storyDetails.text6 },
    { id: 7, src: storyDetails.image7, text: storyDetails.text7 },
  ].filter((item) => item.src); // Φιλτράρουμε τις εικόνες που είναι null

  return (
    <>
      <div style={modalStyle}>
        <div ref={printRef}>
          <h2 style={headerStyle}>{storyDetails.title}</h2>
          <p><strong>{intl.formatMessage({ id: 'Author' })}:</strong> {storyDetails.authorName}</p>
          <p><strong>{intl.formatMessage({ id: 'Synopsis' })}:</strong> {storyDetails.synopsis}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <strong>{intl.formatMessage({ id: 'Rate' })}:</strong>
            <StarRatings
              rating={userRating}
              starRatedColor="gold"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="2px"
              changeRating={onRate ? handleRatingChange : undefined}
            />
          </div>
          <div style={gridStyle}>
            {imagesWithTexts.map((item) => (
              <div key={item.id} style={itemStyle}>
                <img src={item.src || ''} alt={`Story ${item.id}`} style={imageStyle} />
                {item.text && <p style={textStyle}>{item.text}</p>}
              </div>
            ))}
          </div>
          <div style={footerStyle}>
            <button onClick={onClose} style={closeButtonStyle}>
              {intl.formatMessage({ id: 'Close' })}
            </button>
            {showPrintButton && (
              <button onClick={handlePrint} style={printButtonStyle}>
                {intl.formatMessage({ id: 'Print' })}
              </button>
            )}
            {currentUser?.roles?.includes('admin') && onDelete && (
                <button onClick={onDelete} style={deleteButtonStyle}>
                  {intl.formatMessage({ id: 'DeleteStory' })}
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
};
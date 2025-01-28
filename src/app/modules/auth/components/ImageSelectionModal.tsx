import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl'

interface Image {
  id: number;
  src: string;
  alt: string;
  title: string;
}

interface ImageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableImages: Image[];
  onSelectImage: (image: Image) => void;
}

const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
  isOpen,
  onClose,
  availableImages,
  onSelectImage,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 6;
  const intl = useIntl();

  // Reset του pagination όταν ανοίγει το modal
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Υπολογισμός εικόνων για την τρέχουσα σελίδα
  const startIndex = currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = availableImages.slice(startIndex, endIndex);

  // Αριθμός σελίδων
  const totalPages = Math.ceil(availableImages.length / imagesPerPage);

  // Στυλ για το modal
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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 στήλες
    gap: '20px',
    marginTop: '20px',
  };

  const itemStyle: React.CSSProperties = {
    textAlign: 'center',
    cursor: 'pointer',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: '10px',
    transition: 'transform 0.2s',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 15px',
    margin: '0 10px',
    backgroundColor: '#009ef7',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(0); // Μετάβαση στην πρώτη σελίδα
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages - 1); // Μετάβαση στην τελευταία σελίδα
  };

  return (
    <div style={modalStyle}>
      <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>
        {intl.formatMessage({ id: 'SelectanImage' })}
      </h2>
      <div style={gridStyle}>
        {currentImages.map((image) => (
          <div
            key={image.id}
            style={itemStyle}
            onClick={() => onSelectImage(image)}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={imageStyle}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <p style={{ fontSize: '14px', color: '#555', marginTop: '10px' }}>{image.title}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleFirstPage}
          style={{ ...buttonStyle, opacity: currentPage === 0 ? 0.5 : 1 }}
          disabled={currentPage === 0}
        >
          {intl.formatMessage({ id: 'First' })}
        </button>
        <button
          onClick={handlePreviousPage}
          style={{ ...buttonStyle, opacity: currentPage === 0 ? 0.5 : 1 }}
          disabled={currentPage === 0}
        >
          {intl.formatMessage({ id: 'Previous' })}
        </button>
        <span>
          {intl.formatMessage({ id: 'Page' })} {currentPage + 1} {intl.formatMessage({ id: 'of' })} {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          style={{ ...buttonStyle, opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}
          disabled={currentPage === totalPages - 1}
        >
          {intl.formatMessage({ id: 'Next' })}
        </button>
        <button
          onClick={handleLastPage}
          style={{ ...buttonStyle, opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}
          disabled={currentPage === totalPages - 1}
        >
          {intl.formatMessage({ id: 'Last' })}
        </button>
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#ff5c5c',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {intl.formatMessage({ id: 'Cancel' })}
      </button>
    </div>
  );
};

export { ImageSelectionModal };

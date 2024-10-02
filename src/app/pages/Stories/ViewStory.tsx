import React, { useState } from 'react';

// Language dropdown options
interface LanguageOption {
  code: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'el', label: 'Greek' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
];

// Dropdown component
const Dropdown: React.FC<{ onLanguageChange: (lang: string) => void }> = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Select Language');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {selectedLanguage}
        <span style={dropdownStyle.arrow}>▼</span>
      </div>
      {isOpen && (
        <div style={dropdownStyle.menu}>
          {languageOptions.map((option) => (
            <div
              key={option.code}
              style={dropdownStyle.item}
              onClick={() => handleLanguageSelect(option.label)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Dropdown styles
const dropdownStyle = {
  container: {
    position: 'relative',
    display: 'inline-block',
    margin: '20px',
  } as React.CSSProperties,
  dropdown: {
    padding: '12px 20px',
    backgroundColor: '#009ef7',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s, transform 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: 'bold',
    outline: 'none',
  } as React.CSSProperties,
  menu: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    marginTop: '5px',
    animation: 'fadeIn 0.2s',
    width: '200px', // Set a width for the dropdown menu
  } as React.CSSProperties,
  item: {
    padding: '12px 15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: '#f1f1f1',
      fontWeight: 'bold', // Make text bold on hover
    },
  } as React.CSSProperties,
  arrow: {
    marginLeft: '10px',
    fontSize: '12px',
  } as React.CSSProperties,
};

// Main ViewStory component
export const ViewStory = () => {
  const [clickedImageId, setClickedImageId] = useState<number | null>(null);
  const [filteredLanguage, setFilteredLanguage] = useState<string | null>(null);

  const initialImages = [
    { id: 1, src: 'media/Picture7.png', alt: 'Image 1', title: 'Say NO-Limits' },
    { id: 2, src: 'media/Picture8.jpg', alt: 'Image 2', title: 'Negotiate' },
    { id: 3, src: 'media/Picture9.jpg', alt: 'Image 3', title: 'Gather and collect my things at home' },
  ];

  const additionalImages = [
    { id: 4, src: 'media/Picture10.jpg', alt: 'Image 4', title: 'Story Title 4' },
    { id: 5, src: 'media/Picture11.jpg', alt: 'Image 5', title: 'Story Title 5' },
    { id: 6, src: 'media/Picture12.jpg', alt: 'Image 6', title: 'Story Title 6' },
  ];

  const handleImageClick = (id: number) => {
    setClickedImageId(id);
  };

  const handleLanguageChange = (lang: string) => {
    setFilteredLanguage(lang);
    // Add filtering logic here based on the selected language
  };

  // Inline styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    marginTop: '10px',
    marginBottom: '20px',
    fontWeight: 'bold',
  };

  // Header style
  const headerStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically centered
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      {/* Page Header with Dropdown */}
      <div style={headerStyle}>
        <h1>View Storys</h1>
        <Dropdown onLanguageChange={handleLanguageChange} /> {/* Dropdown for language selection */}
      </div>

      {/* Initial Image Row */}
      <div style={gridStyle}>
        {initialImages.map((image) => (
          <div key={image.id} style={{ textAlign: 'center' }}>
            <img
              src={image.src}
              alt={image.alt}
              onClick={() => handleImageClick(image.id)}
              style={imageStyle}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <p style={titleStyle}>{image.title}</p>
          </div>
        ))}
      </div>

      {/* Additional Images - Only shown when an image is clicked */}
      {clickedImageId && (
        <div style={gridStyle}>
          {/* Display the clicked image first */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={initialImages.find((img) => img.id === clickedImageId)?.src}
              alt={`Clicked Image ${clickedImageId}`}
              style={imageStyle}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <p style={titleStyle}>
              {initialImages.find((img) => img.id === clickedImageId)?.title}
            </p>
          </div>
          {/* Then display the additional images */}
          {additionalImages.map((image) => (
            <div key={image.id} style={{ textAlign: 'center' }}>
              <img
                src={image.src}
                alt={image.alt}
                style={imageStyle}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <p style={titleStyle}>{image.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

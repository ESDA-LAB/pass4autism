import React, { useState } from 'react';

// Define the type for images, including language, level, and age
interface Image {
  id: number;
  src: string;
  alt: string;
  title: string;
  language: string;
  level: string;
  age: string; // New property for age filter
}

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

// Levels dropdown options
const levelOptions: string[] = ['level1', 'level2', 'level3'];

// Age dropdown options
const ageOptions: string[] = ['2-5', '10-12', '13-17'];

// Dropdown component for languages
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

// Dropdown component for levels
const LevelsDropdown: React.FC<{ onLevelChange: (level: string) => void }> = ({ onLevelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('Select Level');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    onLevelChange(level);
    setIsOpen(false);
  };

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {selectedLevel}
        <span style={dropdownStyle.arrow}>▼</span>
      </div>
      {isOpen && (
        <div style={dropdownStyle.menu}>
          {levelOptions.map((option) => (
            <div
              key={option}
              style={dropdownStyle.item}
              onClick={() => handleLevelSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Dropdown component for age
const AgeDropdown: React.FC<{ onAgeChange: (age: string) => void }> = ({ onAgeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAge, setSelectedAge] = useState<string>('Select Age');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    onAgeChange(age);
    setIsOpen(false);
  };

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {selectedAge}
        <span style={dropdownStyle.arrow}>▼</span>
      </div>
      {isOpen && (
        <div style={dropdownStyle.menu}>
          {ageOptions.map((option) => (
            <div
              key={option}
              style={dropdownStyle.item}
              onClick={() => handleAgeSelect(option)}
            >
              {option}
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
    margin: '10px 20px',
  } as React.CSSProperties,
  dropdown: {
    padding: '10px 15px',
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
    fontSize: '14px',
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
    width: '200px',
  } as React.CSSProperties,
  item: {
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: '#f1f1f1',
      fontWeight: 'bold',
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
  const [filteredLevel, setFilteredLevel] = useState<string | null>(null);
  const [filteredAge, setFilteredAge] = useState<string | null>(null);

  // Define initial images with all properties
  const initialImages: Image[] = [
    { id: 1, src: 'media/Picture7.png', alt: 'Image 1', title: 'Say NO-Limits', language: 'en', level: 'level1', age: '2-5' },
    { id: 2, src: 'media/Picture8.jpg', alt: 'Image 2', title: 'Negotiate', language: 'es', level: 'level2', age: '10-12' },
    { id: 3, src: 'media/Picture9.jpg', alt: 'Image 3', title: 'Gather and collect my things at home', language: 'it', level: 'level3', age: '13-17' },
  ];

  const additionalImages: Image[] = [
    { id: 4, src: 'media/Picture10.jpg', alt: 'Image 4', title: 'Story Title 4', language: 'el', level: 'level1', age: '2-5' },
    { id: 5, src: 'media/Picture11.jpg', alt: 'Image 5', title: 'Story Title 5', language: 'en', level: 'level2', age: '10-12' },
    { id: 6, src: 'media/Picture12.jpg', alt: 'Image 6', title: 'Story Title 6', language: 'es', level: 'level3', age: '13-17' },
  ];

  const handleImageClick = (id: number) => {
    setClickedImageId(id);
  };

  const handleLanguageChange = (lang: string) => {
    setFilteredLanguage(lang);
  };

  const handleLevelChange = (level: string) => {
    setFilteredLevel(level);
  };

  const handleAgeChange = (age: string) => {
    setFilteredAge(age);
  };

  // Filtering logic based on language, level, and age
  const filterImages = (images: Image[]) => {
    return images.filter(image =>
      (!filteredLanguage || image.language === filteredLanguage) &&
      (!filteredLevel || image.level === filteredLevel) &&
      (!filteredAge || image.age === filteredAge)
    );
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

  const filtersPanelStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      {/* Filters Panel */}
      <div style={filtersPanelStyle}>
        <h2 style={headerStyle}>Filters</h2>
        <Dropdown onLanguageChange={handleLanguageChange} /> {/* Language Dropdown */}
        <LevelsDropdown onLevelChange={handleLevelChange} /> {/* Level Dropdown */}
        <AgeDropdown onAgeChange={handleAgeChange} /> {/* Age Dropdown */}
      </div>

      {/* Initial Image Row */}
      <div style={gridStyle}>
        {filterImages(initialImages).map((image) => (
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

          {/* Display the filtered additional images */}
          {filterImages(additionalImages).map((image) => (
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

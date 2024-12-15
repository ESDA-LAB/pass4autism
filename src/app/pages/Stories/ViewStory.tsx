import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import {getAuth} from '../../modules/auth/core/AuthHelpers';
import { getStories, getStoryDetails } from '../../modules/auth/core/_requests';
import { Modal } from '../../modules/auth/components/Modal';
import { StoryDetails, PaginatedStory } from '../../modules/auth/core/_models'

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
  { code: '', label: 'All Languages' }, // Κενή επιλογή
  { code: 'en', label: 'English' },
  { code: 'gr', label: 'Greek' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
];

// Levels dropdown options
const levelOptions: string[] = ['', 'level1', 'level2', 'level3'];

// Age dropdown options
const ageOptions: string[] = ['', '2-5', '10-12', '13-17'];

// Dropdown component for languages
const LanguageDropdown: React.FC<{ 
  onLanguageChange: (lang: string | undefined) => void, 
  selectedLanguage: string | undefined 
}> = ({ onLanguageChange, selectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (code: string) => {
    onLanguageChange(code || undefined); // Χρησιμοποιούμε το code για backend
    setIsOpen(false);
  };

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {languageOptions.find((option) => option.code === selectedLanguage)?.label || 'All Languages'}
        <span style={dropdownStyle.arrow}>▼</span>
      </div>
      {isOpen && (
        <div style={dropdownStyle.menu}>
          {languageOptions.map((option) => (
            <div
              key={option.code}
              style={dropdownStyle.item}
              onClick={() => handleLanguageSelect(option.code)}
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
const LevelsDropdown: React.FC<{ 
  onLevelChange: (level: string | undefined) => void, 
  selectedLevel: string | undefined 
}> = ({ onLevelChange, selectedLevel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLevelSelect = (level: string) => {
    onLevelChange(level || undefined); // Χρησιμοποιούμε το level για backend
    setIsOpen(false);
  };

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {selectedLevel || 'All Levels'}
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
              {option || 'All Levels'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Dropdown component for age
const AgeDropdown: React.FC<{ 
  onAgeChange: (age: string | undefined) => void, 
  selectedAge: string | undefined 
}> = ({ onAgeChange, selectedAge }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAgeSelect = (age: string) => {
    onAgeChange(age || undefined); // Χρησιμοποιούμε το age για backend
    setIsOpen(false);
  };

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {selectedAge || 'All Ages'}
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
              {option || 'All Ages'}
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

// Στυλ Pagination Controls
const paginationStyle = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    gap: '15px',
  } as React.CSSProperties,
  button: {
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
  } as React.CSSProperties,
  buttonDisabled: {
    backgroundColor: '#c4c4c4',
    color: '#fff',
    cursor: 'not-allowed',
  } as React.CSSProperties,
  text: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
};


// Main ViewStory component
const ViewStoryPage = () => {
  const [clickedImageId, setClickedImageId] = useState<number | null>(null);
  const [filteredLanguage, setFilteredLanguage] = useState<string | undefined>(undefined);
  const [filteredLevel, setFilteredLevel] = useState<string | undefined>(undefined);
  const [filteredAge, setFilteredAge] = useState<string | undefined>(undefined);

  //Προσθήκη Κατάστασης για Εικόνες και Σελίδα
  const [initialImages, setImages] = useState<Image[]>([]); // Για τις εικόνες
  const [currentPage, setCurrentPage] = useState(0); // Τρέχουσα σελίδα
  const [totalPages, setTotalPages] = useState(0);   // Σύνολο σελίδων
  const [storyDetails, setStoryDetails] = useState<StoryDetails>({
    id: 0,
    title: '',
    authorName: '',
    synopsis: '',
    owner: null,
    cover: null,
    rate: 0,
    archived: false,
    shareable: false,
    functional: '',
    keywords: null,
    text1: null,
    text2: null,
    text3: null,
    text4: null,
    text5: null,
    text6: null,
    text7: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    image6: null,
    image7: null,
  }); // Προσθήκη Κατάστασης για τα Additional Images

  //Μετατροπή Δεδομένων JSON σε Τύπο Image
  const mapBackendDataToImages = (data: any[]): Image[] => {
    return data.map((item) => ({
      id: item.id,
      src: item.cover || 'default-image.png', // Χρήση του cover ως εικόνα
      alt: item.title,
      title: item.title,
      language: item.language || 'en', // Υποθέτουμε προεπιλογή για τη γλώσσα
      level: `level${item.functional || 1}`, // Προσαρμογή του functional ως level
      age: '2-5', // Χρησιμοποίησε προεπιλογή αν δεν παρέχεται
    }));
  };

  // useEffect για φόρτωση stories από το backend
  const loadStories = async (filters: { language?: string; level?: string; age?: string } = {}) => {
    try {
      const auth = getAuth();
      if (!auth){
        console.error('No auth token found');
        return;
      }

      //const response = await getStories(auth.token, currentPage, 9, filters);
      const response = await getStories('538684', currentPage, 9, filters);
      const data: PaginatedStory = response.data;

      setImages(mapBackendDataToImages(data.content));
      setTotalPages(data.totalPages);

      if (data.filters?.length && data.filters.length > 0) {
        console.log('Filters from backend:', data.filters);
        const languageFilter = data.filters.find((filter) => filter.key === 'language')?.value;
        const levelFilter = data.filters.find((filter) => filter.key === 'level')?.value;
        const ageFilter = data.filters.find((filter) => filter.key === 'age')?.value;
        if (languageFilter) setFilteredLanguage(languageFilter);
        if (levelFilter) setFilteredLevel(`level${levelFilter}`);
        if (ageFilter) setFilteredAge(ageFilter);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    loadStories({ language: filteredLanguage, level: filteredLevel, age: filteredAge });
  }, [currentPage, filteredLanguage, filteredLevel, filteredAge]);

  //Προσθήκη Πλοήγησης Pagination

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

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Ελέγχει αν το modal είναι ανοιχτό.
  const [selectedStory, setSelectedStory] = useState<Image | null>(null); // Αποθηκεύει την επιλεγμένη ιστορία.

  const openModal = (story: Image) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedStory(null);
    setIsModalOpen(false);
  };
  

  // Define initial images with all properties
  const initialImages1: Image[] = [
    { id: 1, src: 'media/Picture7.png', alt: 'Image 1', title: 'Say NO-Limits', language: 'en', level: 'level1', age: '2-5' },
    { id: 2, src: 'media/Picture8.jpg', alt: 'Image 2', title: 'Negotiate', language: 'es', level: 'level2', age: '10-12' },
    { id: 3, src: 'media/Picture9.jpg', alt: 'Image 3', title: 'Gather and collect my things at home', language: 'it', level: 'level3', age: '13-17' },
  ];

  const storyDetails1: Image[] = [
    { id: 4, src: 'media/Picture10.jpg', alt: 'Image 4', title: 'Story Title 4', language: 'el', level: 'level1', age: '2-5' },
    { id: 5, src: 'media/Picture11.jpg', alt: 'Image 5', title: 'Story Title 5', language: 'en', level: 'level2', age: '10-12' },
    { id: 6, src: 'media/Picture12.jpg', alt: 'Image 6', title: 'Story Title 6', language: 'es', level: 'level3', age: '13-17' },
  ];

  // const handleImageClick = (id: number) => {
  //   setClickedImageId(id);
  // };
  const handleImageClick = async (id: number) => {
    const story = initialImages.find((img) => img.id === id);
    if (story) {
      openModal(story);
      try {
        const auth = getAuth(); // Λήψη token
        if (!auth) {
          console.error('No auth token found');
          return;
        }
  
        //const response = await getStoryDetails(id, auth.token);
        const response = await getStoryDetails(id, '538684');
        const data = response.data;
  
        // Αποθηκεύουμε τα δεδομένα απευθείας στο state
        setStoryDetails(data as StoryDetails);
      } catch (error) {
        console.error('Error fetching story details:', error);
      }
    }
  };

  const handleLanguageChange = (lang: string | undefined) => {
    setFilteredLanguage(lang);
    setCurrentPage(0); // Reset στο pagination
    loadStories({ language: lang, level: filteredLevel, age: filteredAge });
  };
  
  const handleLevelChange = (level: string | undefined) => {
    setFilteredLevel(level);
    setCurrentPage(0); // Reset στο pagination
    loadStories({ language: filteredLanguage, level, age: filteredAge });
  };
  
  const handleAgeChange = (age: string | undefined) => {
    setFilteredAge(age);
    setCurrentPage(0); // Reset στο pagination
    loadStories({ language: filteredLanguage, level: filteredLevel, age });
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
        <LanguageDropdown 
          onLanguageChange={handleLanguageChange} 
          selectedLanguage={filteredLanguage} // Pass the selectedLanguage prop
        />{/* Language Dropdown */}
        <LevelsDropdown 
          onLevelChange={handleLevelChange} 
          selectedLevel={filteredLevel} // Pass the selectedLevel prop
        />{/* Level Dropdown */}
        <AgeDropdown 
          onAgeChange={handleAgeChange} 
          selectedAge={filteredAge} // Pass the selectedAge prop
        />{/* Age Dropdown */}
      </div>


      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        /*selectedStory={selectedStory} */
        storyDetails={storyDetails}
      />

      {/* Initial Image Row from images*/}
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

      {/*Προσθήκη Πλοήγησης Pagination*/}
      <div style={paginationStyle.container}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          style={{
            ...paginationStyle.button,
            ...(currentPage === 0 ? paginationStyle.buttonDisabled : {}),
          }}
        >
          Previous
        </button>
        <span style={paginationStyle.text}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          style={{
            ...paginationStyle.button,
            ...(currentPage === totalPages - 1 ? paginationStyle.buttonDisabled : {}),
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ViewStory: React.FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.VIEW_STORIES' })}</PageTitle>
      <ViewStoryPage />
    </>
  );
};

export { ViewStory };
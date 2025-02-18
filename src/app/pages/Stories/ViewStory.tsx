import React, { useState, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import {getAuth} from '../../modules/auth/core/AuthHelpers';
import { getStories, getStoryDetails, deleteStoryById, rateStoryById } from '../../modules/auth/core/_requests';
import { Modal } from '../../modules/auth/components/Modal';
import { StoryDetails, PaginatedStory } from '../../modules/auth/core/_models'
import { StatisticsWidget5 } from '../../../_metronic/partials/widgets';
import {useAuth} from '../../../app/modules/auth'; // Πρόσβαση στο Auth Context

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

// Age dropdown options
const ageOptions: string[] = ['', '2-5', '6-9', '10-12', '13-17'];

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
  const intl = useIntl();
  
  const languageOptions: LanguageOption[] = [
    { code: '', label: intl.formatMessage({ id: 'AllLanguages' }) }, // Κενή επιλογή
    { code: 'en', label: intl.formatMessage({ id: 'English' }) },
    { code: 'es', label: intl.formatMessage({ id: 'Spanish' }) },
    { code: 'gr', label: intl.formatMessage({ id: 'Greek' }) },
    { code: 'it', label: intl.formatMessage({ id: 'Italian' }) },
  ];

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {languageOptions.find((option) => option.code === selectedLanguage)?.label || intl.formatMessage({ id: 'AllLanguages' })}
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
  const intl = useIntl();

  // Levels dropdown options
  const levelOptions: string[] = ['', 'level1', 'level2', 'level3'];

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {selectedLevel || intl.formatMessage({ id: 'AllLevels' })}
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
              {option.replace('level', intl.formatMessage({ id: 'Level' })) || intl.formatMessage({ id: 'AllLevels' })}
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
  const intl = useIntl();

  return (
    <div style={dropdownStyle.container}>
      <div style={dropdownStyle.dropdown} onClick={toggleDropdown}>
        {selectedAge || intl.formatMessage({ id: 'AllAges' })}
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
              {option || intl.formatMessage({ id: 'AllAges' })}
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
  // Wrap the loadStories function with useCallback
  const loadStories = useCallback(
    async (filters: { language?: string; level?: string; age?: string } = {}) => {
      try {
        const auth = getAuth();
        if (!auth) {
          console.error('No auth token found');
          return;
        }

        const response = await getStories(auth.token, currentPage, 9, filters);
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
    },
    [currentPage] // Add dependencies such as currentPage, or any variables used inside loadStories
  );

  useEffect(() => {
    loadStories({ language: filteredLanguage, level: filteredLevel, age: filteredAge });
  }, [currentPage, filteredLanguage, filteredLevel, filteredAge, loadStories]);

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

  const handleFirstPage = () => {
    setCurrentPage(0); // Μετάβαση στην πρώτη σελίδα
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages - 1); // Μετάβαση στην τελευταία σελίδα
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

  const handleDeleteStory = async (storyId: number) => {
    if (!storyId) return; // Αν δεν υπάρχει ID, δεν προχωράμε
  
    const confirmDelete = window.confirm("Are you sure you want to delete this story?");
    if (!confirmDelete) return; // Αν ο χρήστης ακυρώσει, δεν κάνουμε τίποτα
  
    try {
      const auth = getAuth(); // Λήψη token
      if (!auth) {
        console.error('No auth token found');
        return;
      }
      const authToken = 'mock-auth-token'; // Εδώ βάλε το πραγματικό token
      //await deleteStoryById(storyId, auth.token); // Κλήση στο API
      await deleteStoryById(storyId, authToken); // Κλήση στο API
      // Αφαίρεση της ιστορίας από το state
      setImages((prevImages) => prevImages.filter((image) => image.id !== storyId));
      closeModal(); // Κλείσιμο του modal
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete the story. Please try again.");
    }
  };

  const handleRatingStory = async (storyId: number, rating: number) => {
    if (!storyId) return; // Αν δεν υπάρχει ID, δεν προχωράμε
  
    try {
      const auth = getAuth(); // Λήψη token
      if (!auth) {
        console.error('No auth token found');
        return;
      }
      
      const authToken = 'mock-auth-token'; // Εδώ βάλε το πραγματικό token
      //await rateStoryById(storyId, auth.token); // Κλήση στο API
      await rateStoryById(storyId, rating, authToken); // Κλήση στο API
      
      // Ενημέρωση της τοπικής κατάστασης αν χρειάζεται
      setStoryDetails((prevDetails) => ({
        ...prevDetails,
        rate: rating,
      }));
  
    } catch (error) {
      console.error('Failed to save rating', error);
      alert('Failed to save the rating. Please try again.');
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
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    maxWidth: '800px',
    textAlign: 'center',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };
  const intl = useIntl();
  const {currentUser} = useAuth(); // Πρόσβαση στον τρέχοντα χρήστη και τους ρόλους του

  return (
    <>
      {/* Header Section */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-12'>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-5'
            svgIcon='/media/icons/duotune/general/gen004.svg'
            color='primary'
            iconColor='white'
            title={intl.formatMessage({ id: 'ViewStory.ViewVisualStories' })}
            description={intl.formatMessage({ id: 'ViewStory.Viewingvisualstories.' })}
            titleColor='white'
            descriptionColor='white'
          />
        </div>
      </div>
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
          showPrintButton={true}
          onClose={closeModal}
          onDelete={() => handleDeleteStory(storyDetails.id)} // Ενεργοποίηση του κουμπιού διαγραφής
          onRate={(rating) => handleRatingStory(storyDetails.id, rating)} // Νέο prop
          currentUser ={currentUser}
          /*selectedStory={selectedStory} */
          storyDetails={storyDetails}
        />

        {/* Initial Image Row from images*/}
        <div style={gridStyle}>
          {filterImages(initialImages).map((image) => (
            <div key={image.id} style={gridItemStyle}
              onClick={() => handleImageClick(image.id)}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
              <img
                src={image.src}
                alt={image.alt}
                style={imageStyle}
              />
              <p style={titleStyle}>{image.title}</p>
            </div>
          ))}
        </div>

        {/*Προσθήκη Πλοήγησης Pagination*/}
        <div style={paginationStyle.container}>
          <button
            onClick={handleFirstPage}
            disabled={currentPage === 0}
            style={{
              ...paginationStyle.button,
              ...(currentPage === 0 ? paginationStyle.buttonDisabled : {}),
            }}
          >
            {intl.formatMessage({ id: 'First' })}
          </button>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            style={{
              ...paginationStyle.button,
              ...(currentPage === 0 ? paginationStyle.buttonDisabled : {}),
            }}
          >
            {intl.formatMessage({ id: 'Previous' })}
          </button>
          <span style={paginationStyle.text}>
            {intl.formatMessage({ id: 'Page' })} {currentPage + 1} {intl.formatMessage({ id: 'of' })} {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            style={{
              ...paginationStyle.button,
              ...(currentPage === totalPages - 1 ? paginationStyle.buttonDisabled : {}),
            }}
          >
            {intl.formatMessage({ id: 'Next' })}
          </button>
          <button
            onClick={handleLastPage}
            disabled={currentPage === totalPages - 1}
            style={{
              ...paginationStyle.button,
              ...(currentPage === totalPages - 1 ? paginationStyle.buttonDisabled : {}),
            }}
          >
            {intl.formatMessage({ id: 'Last' })}
          </button>
        </div>
      </div>
    </>
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
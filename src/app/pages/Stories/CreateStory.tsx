import { useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import { StatisticsWidget5 } from '../../../_metronic/partials/widgets';
import { getStories } from '../../modules/auth/core/_requests';
import { StoryDetails } from '../../modules/auth/core/_models';
import { useNavigate } from 'react-router-dom'; // Για πλοήγηση

interface Story {
  id: number;
  title: string;
  text: string;
  images: { url: string; title: string }[];
}

const CreateStoryPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false); // Ελέγχουμε αν έχει γίνει αναζήτηση
  const navigate = useNavigate(); // Χρησιμοποιείται για πλοήγηση στη νέα σελίδα

  // Function to fetch stories with pagination
  const fetchStories = async (page: number = 0, searchQuery: string = query) => {
    setLoading(true);
    setError(null);
    try {
      const authToken = 'mock-auth-token'; // Replace with actual auth token retrieval logic
      const response = await getStories(authToken, page, 9, { searchKeywords: searchQuery });
      const { content, totalPages: pages } = response.data;

      // Map API response to the Story format
      const mappedResults = content.map((item: StoryDetails) => ({
        id: item.id,
        title: item.title,
        text: item.synopsis || '',
        images: [{ url: item.cover || 'default-image.png', title: item.title || 'No Title' }],
      }));

      setResults(mappedResults);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to fetch search results.');
    } finally {
      setLoading(false);
      setHasSearched(true); // Ορίζουμε ότι έγινε αναζήτηση
    }
  };

  // Function to handle search
  const handleSearch = () => {
    fetchStories(0);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchStories(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchStories(currentPage - 1);
    }
  };

  // Handle story click
  const handleStoryClick = (id: number) => {
    navigate(`/stories/${id}`); // Πλοήγηση στη νέα σελίδα με βάση το ID της ιστορίας
  };

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
    textAlign: 'center',
  };

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

  return (
    <>
      {/* Header Section */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-12'>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-5'
            svgIcon='/media/icons/duotune/arrows/arr013.svg'
            color='primary'
            iconColor='white'
            title='Create Visual Story'
            description='<ul><li>Search through existing stories using keywords</li><li>Select and edit the one you like</li><li>Modify the text and images</li><li>Click Save.</li></ul>'
            titleColor='white'
            descriptionColor='white'
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className='col-xl-12 d-flex align-items-center justify-content-center'>
        <div className='input-group'>
          <input
            type='text'
            className='form-control form-control-lg'
            placeholder='Search visual stories...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className='btn btn-primary' onClick={handleSearch}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      <div style={containerStyle}>
        {!hasSearched && <p>Please use the search bar to look for visual stories.</p>}
        {hasSearched && results.length === 0 && !loading && (
          <p>No stories found. Try different keywords to find what you're looking for.</p>
        )}
        {results.length > 0 && (
          <div style={gridStyle}>
            {results.map((story) => (
              <div key={story.id} style={gridItemStyle}
                onClick={() => handleStoryClick(story.id)} // Πλοήγηση στη νέα σελίδα
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                <img
                  src={story.images[0].url}
                  alt={story.images[0].title}
                  style={imageStyle}
                />
                <p style={titleStyle}>{story.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {hasSearched && results.length > 0 && totalPages > 1 && (
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
        )}
      </div>
    </>
  );
};

const CreateStory: React.FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.CREATE_STORY' })}</PageTitle>
      <CreateStoryPage />
    </>
  );
};

export { CreateStory };

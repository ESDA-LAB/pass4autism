import { useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import { StatisticsWidget5 } from '../../../_metronic/partials/widgets';
import { getStories } from '../../modules/auth/core/_requests';
import { StoryDetails } from '../../modules/auth/core/_models'

interface Story {
  id: number;
  title: string;
  text: string;
  images: { url: string; title: string }[];
}

const CreateStoryPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle search
  const handleSearch = async (page: number = 0) => {
    setLoading(true);
    setError(null);
  
    try {
      const authToken = 'mock-auth-token'; // Replace with actual auth token retrieval logic
      const response = await getStories(authToken, page, 10, { searchKeywords: query });
  
      const { content, totalPages: pages } = response.data;
  
      const mappedContent = content.map((item: StoryDetails) => ({
        id: item.id,
        title: item.title,
        text: item.synopsis || '', // Use synopsis as a default
        images: [
          { url: item.cover || 'default-image.png', title: item.title || 'No Title' },
        ], // Map cover as the single image
      }));
  
      setResults(mappedContent);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to fetch search results.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle selecting a story
  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
  };

  // Function to handle edit
  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  // Function to save the new title
  const handleSaveTitle = (index: number, newTitle: string) => {
    if (selectedStory) {
      const updatedImages = [...selectedStory.images];
      updatedImages[index].title = newTitle;
      setSelectedStory({ ...selectedStory, images: updatedImages });
      setEditingIndex(null);
    }
  };

  // Function to handle story save
  const handleSaveStory = () => {
    const savePayload = {
      story: selectedStory,
      isPublic,
    };
    console.log('Saving Story:', savePayload);
    // You can add your API request here to save the story
  };

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      handleSearch(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      handleSearch(currentPage - 1);
    }
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
            description='When creating a visual story: Search through existing stories using keywords, select and edit the one you like, modify the text and images, and when saving, a new version is created with the author’s name, specifying whether it will be public or not.'
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
            aria-label='Search'
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update query state
          />
          <button className='btn btn-primary' type='button' onClick={() => handleSearch(0)}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className='col-xl-12 mt-4 d-flex flex-column align-items-center'>
        {loading && <p>Loading results...</p>}
        {error && <p className='text-danger'>{error}</p>}
        {results.length > 0 ? (
          <div className="search-results text-center">
            {results.map((result: any) => (
              <div
                key={result.id}
                className="search-result-item"
                onClick={() => handleSelectStory(result)}
                style={{ cursor: 'pointer' }}
              >
                {result.images?.[0] && ( // Check if the first image exists
                  <>
                    <img
                      src={result.images[0].url}
                      alt={result.images[0].title}
                      width="300"
                      className="mb-3"
                      style={{ display: 'block', margin: '0 auto' }}
                    />
                    <p>{result.text}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No results found</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='col-xl-12 d-flex justify-content-center mt-4'>
          <button
            className='btn btn-secondary me-2'
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className='btn btn-secondary ms-2'
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      {/* Selected Story Display */}
      {selectedStory && (
        <div className='col-xl-12 mt-4'>
          <h2>{selectedStory.title}</h2>
          <div className='row'>
            {selectedStory.images.map((image, index) => (
              <div className='col-lg-4 text-center' key={index}>
                <img src={image.url} alt={`Story image ${index + 1}`} className='img-fluid' />
                {editingIndex === index ? (
                  <div>
                    <input
                      type='text'
                      value={image.title}
                      onChange={(e) =>
                        handleSaveTitle(index, e.target.value) // Save the new title on change
                      }
                    />
                    <button
                      className='btn btn-primary mt-2'
                      onClick={() => handleSaveTitle(index, image.title)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{image.title}</p>
                    <button className='btn btn-secondary mt-2' onClick={() => handleEdit(index)}>
                      Edit Title
                    </button>
                    <button className='btn btn-info mt-2 ms-2'>Edit Image</button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Public/Private Selection */}
          <div className='mt-4 d-flex justify-content-center'>
            <label className='me-3' style={{ fontSize: '1.2rem' }}>Make Story Public:</label>
            <input
              type='checkbox'
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)} // Toggle public/private status
            />
          </div>

          {/* Save Button */}
          <div className='mt-4 d-flex justify-content-center'>
            <button className='btn btn-success' onClick={handleSaveStory}>
              Save Story
            </button>
          </div>
        </div>
      )}
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

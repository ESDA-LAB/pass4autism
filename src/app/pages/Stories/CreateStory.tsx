import { useState } from 'react'
import axios from 'axios'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { StatisticsWidget5 } from '../../../_metronic/partials/widgets'

const CreateStoryPage = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selectedStory, setSelectedStory] = useState<any | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null) // To track the editing index
  const [isPublic, setIsPublic] = useState(false) // New state for public/private status
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to handle search
  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      setResults([
        {
          id: 1,
          title: 'Share a toy',
          text: 'Share a toy',
          images: [
            { url: 'media/Picture1.jpg', title: 'In the school' },
            { url: 'media/Picture2.jpg', title: 'I play' },
            { url: 'media/Picture3.jpg', title: 'With other children' },
            { url: 'media/Picture4.jpg', title: 'We play' },
            { url: 'media/Picture5.jpg', title: 'We share the toys' },
            { url: 'media/Picture6.jpg', title: 'We play together' },
          ], // Array of image URLs with titles
        },
      ]) // Store search results
    } catch (error) {
      setError('Failed to fetch search results.')
    } finally {
      setLoading(false)
    }
  }

  // Function to handle selecting a story
  const handleSelectStory = (story: any) => {
    setSelectedStory(story)
  }

  // Function to handle edit
  const handleEdit = (index: number) => {
    setEditingIndex(index)
  }

  // Function to save the new title
  const handleSaveTitle = (index: number, newTitle: string) => {
    if (selectedStory) {
      const updatedImages = [...selectedStory.images]
      updatedImages[index].title = newTitle
      setSelectedStory({ ...selectedStory, images: updatedImages })
      setEditingIndex(null) // Stop editing mode
    }
  }

  // Function to handle story save
  const handleSaveStory = () => {
    const savePayload = {
      story: selectedStory,
      isPublic,
    }
    console.log('Saving Story:', savePayload)
    // You can add your API request here to save the story
  }

  return (
    <>
      {/* begin::Row */}
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
          <button className='btn btn-primary' type='button' onClick={handleSearch}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className='col-xl-12 mt-4 d-flex flex-column align-items-center'>
        {loading && <p>Loading results...</p>}
        {error && <p className='text-danger'>{error}</p>}
        {results.length > 0 ? (
          <div className='search-results text-center'>
            {results.map((result: any) => (
              <div
                key={result.id}
                className='search-result-item'
                onClick={() => handleSelectStory(result)} // Handle story selection
                style={{ cursor: 'pointer' }}
              >
                {/* Hide the selected cover */}
                {selectedStory?.id !== result.id && (
                  <>
                    <img
                      src={result.images[0].url} // Display the first image as a thumbnail
                      alt={result.title}
                      width='300'
                      className='mb-3'
                      style={{ display: 'block', margin: '0 auto' }} // Center the image
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

      {/* Selected Story Display */}
      {selectedStory && (
        <div className='col-xl-12 mt-4'>
          <h2>{selectedStory.title}</h2>
          <div className='row'>
            {selectedStory.images.slice(0, 3).map((image: any, index: number) => (
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
          <div className='row mt-3'>
            {selectedStory.images.slice(3, 6).map((image: any, index: number) => (
              <div className='col-lg-4 text-center' key={index + 3}>
                <img src={image.url} alt={`Story image ${index + 4}`} className='img-fluid' />
                {editingIndex === index + 3 ? (
                  <div>
                    <input
                      type='text'
                      value={image.title}
                      onChange={(e) =>
                        handleSaveTitle(index + 3, e.target.value) // Save the new title on change
                      }
                    />
                    <button
                      className='btn btn-primary mt-2'
                      onClick={() => handleSaveTitle(index + 3, image.title)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{image.title}</p>
                    <button
                      className='btn btn-secondary mt-2'
                      onClick={() => handleEdit(index + 3)}
                    >
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
  )
}

const CreateStory = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.CREATE_STORY' })}</PageTitle>
      <CreateStoryPage />
    </>
  )
}

export { CreateStory }

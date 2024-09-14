import { useState } from 'react'
import axios from 'axios'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { StatisticsWidget5 } from '../../../_metronic/partials/widgets'

const CreateStoryPage = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to handle search
  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      setResults([{
        id: 1,
        title: "Demo Visual Story",
        text: "This is a sample visual story created for demo purposes.",
        imageUrl: "media/ab_1.png"  // Path to your uploaded image
      }]) // Store search results
    } catch (error) {
      setError('Failed to fetch search results.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-5'>
        <div className="col-xl-12">
          <StatisticsWidget5
            className="card-xl-stretch mb-xl-8"
            svgIcon="/media/icons/duotune/arrows/arr013.svg"
            color="primary"
            iconColor="white"
            title="Create Visual Story"
            description="When creating a visual story:
                          Search through existing stories using keywords
                          Select and edit the one you like
                          Modify the text and images
                          When saving, a new version is created with the author’s name, specifying whether it will be public or not."
            titleColor="white"
            descriptionColor="white"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="col-xl-12 d-flex align-items-center justify-content-center">
        <div className="input-group">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search visual stories..."
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}  // Update query state
          />
          <button className="btn btn-primary" type="button" onClick={handleSearch}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="col-xl-12 mt-4 d-flex flex-column align-items-center">
        {loading && <p>Loading results...</p>}
        {error && <p className="text-danger">{error}</p>}
        {results.length > 0 ? (
          <div className="search-results text-center">
            {results.map((result: any) => (
              <div key={result.id} className="search-result-item">
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  width="300"
                  className="mb-3"
                  style={{ display: 'block', margin: '0 auto' }}  // Center the image
                />
                <p>{result.text}</p>
                {/* Buttons below the image */}
                <div className="mt-3 d-flex justify-content-center">
                  <button className="btn btn-secondary me-2">Edit</button>
                  <button className="btn btn-danger me-2">Delete</button>
                  <button className="btn btn-info">Share</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No results found</p>
        )}
      </div>
    </>
  )
}

const CreateStory = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.CREATE_STORY'})}</PageTitle>
      <CreateStoryPage />
    </>
  )
}

export { CreateStory }

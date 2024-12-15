import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTitle } from '../../../_metronic/layout/core';
import { StoryDetails } from '../../modules/auth/core/_models';
import { getStoryDetails/*, updateStoryDetails*/ } from '../../modules/auth/core/_requests';
import { ImageSelectionModal } from '../../modules/auth/components/ImageSelectionModal';

const DetailsStoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Παίρνουμε το ID της ιστορίας από το URL
  const navigate = useNavigate();
  const [story, setStory] = useState<StoryDetails | null>(null);
  const [originalStory, setOriginalStory] = useState<StoryDetails | null>(null); // Αρχική κατάσταση
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string | null>(null);

  const openModal = (imageField: string) => {
    setCurrentImageField(imageField);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageField(null);
  };

  const handleSelectImage = (imageUrl: string) => {
    if (story && currentImageField) {
      setStory({
        ...story,
        [currentImageField]: imageUrl,
      });
    }
    closeModal();
  };

  // Κλήση στο backend για φόρτωση των λεπτομερειών της ιστορίας
  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        setLoading(true);
        const authToken = 'mock-auth-token'; // Replace with actual auth token retrieval logic
        const response = await getStoryDetails(Number(id), authToken);
        setStory(response.data);
        setOriginalStory(response.data); // Αποθήκευση της αρχικής κατάστασης
        setIsPublic(response.data.shareable);
      } catch (err) {
        console.error('Error fetching story details:', err);
        setError('Failed to load story details.');
      } finally {
        setLoading(false);
      }
    };

    fetchStoryDetails();
  }, [id]);

  // Αλλαγή τιμών στα στοιχεία της ιστορίας
  const handleChange = (field: keyof StoryDetails, value: string | boolean | null) => {
    if (story) {
      setStory({
        ...story,
        [field]: field === 'rate' ? Number(value) : value, // Μετατροπή σε number αν είναι το πεδίο 'rate'
      });
    }
  };

  const hasChanges = (): boolean => {
    return JSON.stringify(story) !== JSON.stringify(originalStory);
  };

  // Αποθήκευση αλλαγών
  const handleSave = async () => {
    try {
      if (story) {
        const authToken = 'mock-auth-token'; // Replace with actual auth token retrieval logic
        //await updateStoryDetails(story.id, { ...story, shareable: isPublic }, authToken);
        setOriginalStory(story); // Ενημερώνουμε την αρχική κατάσταση μετά την αποθήκευση
        navigate('/create-story'); // Επιστροφή στη σελίδα CreateStory μετά την αποθήκευση
      }
    } catch (err) {
      console.error('Error updating story details:', err);
      setError('Failed to save changes.');
    }
  };

  // Επιστροφή στη σελίδα CreateStory
  const handleCancel = () => {
    navigate('/createStory');
  };

  if (loading) {
    return <p>Loading story details...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!story) {
    return <p>Story not found.</p>;
  }

  return (
    <div className="container">
      <h1>Edit Story and Save it as new</h1>
      {/* Τίτλος */}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="form-control"
          value={story.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      {/* Σύνοψη */}
      <div className="form-group">
        <label htmlFor="synopsis">Synopsis</label>
        <textarea
          id="synopsis"
          className="form-control"
          rows={4}
          value={String(story.synopsis || '')}
          onChange={(e) => handleChange('synopsis', e.target.value)}
        ></textarea>
      </div>

      {/* Cover */}
      <div className="form-group mb-4">
        <label>Cover Image</label>
        {story?.cover ? (
          <>
            <img
              src={story.cover}
              alt="Cover"
              className="img-fluid mb-3"
              style={{ width: '300px', height: 'auto' }}
            />
            <button
              className="btn btn-secondary"
              onClick={() => openModal('cover')}
            >
              Change Cover
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => openModal('cover')}
          >
            Add Cover
          </button>
        )}
      </div>

      {/* Rate */}
      <div className="form-group">
        <label htmlFor="rate">Rate</label>
        <input
          id="rate"
          type="number"
          className="form-control"
          min="0"
          max="5"
          value={story.rate || 0}
          onChange={(e) => handleChange('rate', e.target.value)}
        />
      </div>

      {/* Functional (Level) */}
      <div className="form-group">
        <label htmlFor="functional">Level</label>
        <select
          id="functional"
          className="form-control"
          value={story.functional}
          onChange={(e) => handleChange('functional', e.target.value)}
        >
          <option value="level1">Level 1</option>
          <option value="level2">Level 2</option>
          <option value="level3">Level 3</option>
        </select>
      </div>

      {/* Keywords */}
      <div className="form-group">
        <label htmlFor="keywords">Keywords</label>
        <textarea
          id="keywords"
          className="form-control"
          rows={3}
          value={story.keywords || ''}
          onChange={(e) => handleChange('keywords', e.target.value)}
        ></textarea>
      </div>

      {/* Εικόνες */}
      <div className="form-group">
        <label>Images</label>
        {[...Array(7)].map((_, index) => {
          const imageField = `image${index + 1}` as keyof StoryDetails;
          const imageValue = story?.[imageField];

          return (
            <div key={index} className="mb-3">
              <label>Image {index + 1}</label>
              {imageValue ? (
                <>
                  <img
                    src={imageValue as string}
                    alt={`Story image ${index + 1}`}
                    className="img-thumbnail"
                    style={{ width: '100px', marginRight: '10px' }}
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={() => openModal(imageField)}
                  >
                    Change Image
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => openModal(imageField)}
                >
                  Add Image
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Modal */}
      <ImageSelectionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        availableImages={[
          { id: 1, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_24.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=2baeecf00ea4987fd7a6cd0e70d6e7d46a46da9d3b842757c435cb459959d6d3', alt: 'Image 1', title: 'Placeholder 1' },
          { id: 2, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_25.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=6c2b21ec18939eb23b18b2379324c6a44061cabe5f72c1e17018660c6cfd5602', alt: 'Image 2', title: 'Placeholder 2' },
          { id: 3, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 4, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 5, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 6, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 7, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 8, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 9, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 10, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 22, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 12, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
          { id: 14, src: 'http://storage.atlas.esdalab.ece.uop.gr/pass4autism/ab_26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pass4autism%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T175500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=cb711c8443f34438033333714500cfe4f00ca21146ddcfb9674032e17b708f76', alt: 'Image 3', title: 'Placeholder 3' },
        ]}
        onSelectImage={(image) => {
          if (currentImageField) {
            setStory({
              ...story,
              [currentImageField]: image.src,
            });
          }
          closeModal();
        }}
      />

      {/* Public Checkbox */}
      <div className="form-check">
        <input
          id="public"
          type="checkbox"
          className="form-check-input"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label htmlFor="public" className="form-check-label">
          Make Public
        </label>
      </div>

      {/* Κείμενα */}
      {[...Array(7)].map((_, index) => {
        const textField = `text${index + 1}` as keyof StoryDetails;
        return (
          <div key={index} className="form-group">
            <label htmlFor={textField}>Text {index + 1}</label>
            <textarea
              id={textField}
              className="form-control"
              rows={3}
              value={String(story[textField] || '')} // Ασφαλής μετατροπή
              onChange={(e) => handleChange(textField, e.target.value)}
            ></textarea>
          </div>
        );
      })}

      {/* Buttons */}
      <div className="mt-4">
        <button className="btn btn-success me-2" onClick={handleSave}
          disabled={!hasChanges()} // Ανενεργό αν δεν έχουν γίνει αλλαγές
        >
          Save
        </button>
        <button className="btn btn-danger" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const DetailsStory: React.FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.CREATE_STORY' })}</PageTitle>
      <DetailsStoryPage />
    </>
  );
};

export { DetailsStory };

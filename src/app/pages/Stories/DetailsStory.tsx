import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTitle } from '../../../_metronic/layout/core';
import { StoryDetails } from '../../modules/auth/core/_models';
import { getStoryDetails, createStoryDetails, getStoriesImages } from '../../modules/auth/core/_requests';
import { ImageSelectionModal } from '../../modules/auth/components/ImageSelectionModal';
import {getAuth} from '../../modules/auth/core/AuthHelpers';
import StarRatings from 'react-star-ratings';

const DetailsStoryPage: React.FC = () => {
  const intl = useIntl();
  const { id } = useParams<{ id: string }>(); // Παίρνουμε το ID της ιστορίας από το URL
  const navigate = useNavigate();
  const [story, setStory] = useState<StoryDetails | null>(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [originalStory, setOriginalStory] = useState<StoryDetails | null>(null); // Αρχική κατάσταση
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    title: null as string | null,
    synopsis: null as string | null,
    cover: null as string | null,
    keywords: null as string | null,
    language: null as string | null,
    ages: null as string | null,
  });
  

  const openModal = (imageField: string) => {
    setCurrentImageField(imageField);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageField(null);
  };

  // Κλήση στο backend για φόρτωση των λεπτομερειών της ιστορίας
  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        const auth = getAuth();
        if (!auth) {
          console.error('No auth token found');
          return;
        }
        setLoading(true);
        const response = await getStoryDetails(Number(id), auth.token);
        setStory(response.data);
        setOriginalStory(response.data); // Αποθήκευση της αρχικής κατάστασης
        //setIsPublic(response.data.shareable);
        const responseStoriesImages = await getStoriesImages(auth.token);
        const transformedImages = responseStoriesImages.data.map((url: String, index: number) => ({
          id: index + 1,    // Το id θα είναι το index + 1 (για να ξεκινά από το 1)
          src: url,        // Το URL της εικόνας
          alt: url.split('/').pop(),   // Το όνομα του αρχείου (τελευταίο μέρος του URL)
          title: url.split('/').pop()  // Το όνομα του αρχείου (το ίδιο με το alt)
        }));
        setImageUrls(transformedImages); // Αποθήκευση των μετασχηματισμένων εικόνων
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
        [field]: value,
      });
    }
  };

  const hasChanges = (): boolean => {
    return JSON.stringify(story) !== JSON.stringify(originalStory);
  };

  // Αποθήκευση αλλαγών
  const handleSave = async () => {
    // Ελέγχουμε αν το story είναι null και επιστρέφουμε αν είναι
    if (!story) {
      console.error('Story is null');
      return;
    }

    // Συνάρτηση για να εξάγουμε το όνομα του αρχείου από το URL
    const extractFileName = (url: string | null): string | null => {
      if (!url) return null;
      return url.split('/').pop()?.split('?')[0] ?? null; // Επιστρέφει το όνομα αρχείου ή null
    };
  
    // Λίστα με τα πεδία που είναι string ή null (για εικόνες)
    const imageFields: (keyof StoryDetails)[] = [
      "cover", "image1", "image2", "image3", "image4", "image5", "image6", "image7"
    ];
  
    // Δημιουργούμε ένα νέο αντικείμενο με το πεδίο του story όπου τα πεδία εικόνας είναι τροποποιημένα
    const updatedStory: StoryDetails = {
      ...story,
      ...Object.fromEntries(
        imageFields
          .map((field) => {
            const fieldValue = story[field as keyof StoryDetails];
            // Ελέγχουμε αν η τιμή είναι string ή null για να την επεξεργαστούμε
            return [field, typeof fieldValue === 'string' ? extractFileName(fieldValue) : fieldValue];
          })
          .filter(([_, value]) => value !== null) // Φιλτράρουμε τα πεδία με null τιμές
      ),
    };
  
    // Δημιουργία νέων σφαλμάτων για την επικύρωση των πεδίων
    let newErrors = {
      title: updatedStory?.title.trim() ? null : intl.formatMessage({ id: 'DetailsStory.Titleisrequired' }),
      synopsis: updatedStory?.synopsis?.trim() ? null : intl.formatMessage({ id: 'DetailsStory.Synopsisisrequired' }),
      cover: updatedStory?.cover ? null : intl.formatMessage({ id: 'DetailsStory.CoverImageisrequired' }),
      keywords: updatedStory?.keywords?.trim() ? null : intl.formatMessage({ id: 'DetailsStory.Keywordsarerequired' }),
      language: updatedStory?.language ? null : intl.formatMessage({ id: 'DetailsStory.Languageisrequired' }),
      ages: updatedStory?.ages ? null : intl.formatMessage({ id: 'DetailsStory.Agerangeisrequired' }),
    };
  
    setErrors(newErrors);
  
    // Αν υπάρχουν σφάλματα, σταματάμε τη διαδικασία αποθήκευσης
    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }
  
    try {
      // Αν το story είναι έγκυρο, αποθηκεύουμε τις αλλαγές
      if (updatedStory) {
        const auth = getAuth();
        if (!auth) {
          console.error('No auth token found');
          return;
        }
  
        // Δημιουργούμε ή ενημερώνουμε την ιστορία με τις νέες τιμές
        await createStoryDetails({ ...updatedStory, shareable: isPublic }, auth.token);
        setOriginalStory(updatedStory); // Ενημέρωση της αρχικής κατάστασης μετά την αποθήκευση
        navigate('/dashboard'); // Επιστροφή στο Dashboard μετά την αποθήκευση
      }
    } catch (err) {
      console.error('Error creating story details:', err);
      setError('Failed to save changes.');
    }
  };  

  // Επιστροφή στη σελίδα CreateStory
  const handleCancel = () => {
    navigate('/createStory');
  };

  if (loading) {
    return <p>{intl.formatMessage({ id: 'DetailsStory.Loadingstorydetails...' })}</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!story) {
    return <p>{intl.formatMessage({ id: 'DetailsStory.Storynotfound.' })}</p>;
  }

  return (
    <div className="container">
      <h1>{intl.formatMessage({ id: 'Title' })}: {originalStory?.title} - {intl.formatMessage({ id: 'DetailsStory.EditStoryandSaveitasnew' })}</h1>
      {/* Τίτλος */}
      <div className="form-group">
        <label htmlFor="title">{intl.formatMessage({ id: 'NewTitle' })}</label>
        <input
          id="title"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          //value={story.title}
          onChange={(e) => {
            handleChange('title', e.target.value);
            setErrors({ ...errors, title: e.target.value.trim() ? null : errors.title });
          }}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      {/* Σύνοψη */}
      <div className="form-group">
        <label htmlFor="synopsis">{intl.formatMessage({ id: 'Synopsis' })}</label>
        <textarea
          id="synopsis"
          className={`form-control ${errors.synopsis ? 'is-invalid' : ''}`}
          rows={4}
          value={story.synopsis || ''}
          onChange={(e) => {
            handleChange('synopsis', e.target.value);
            setErrors({ ...errors, synopsis: e.target.value.trim() ? null : errors.synopsis });
          }}
        ></textarea>
        {errors.synopsis && <div className="invalid-feedback">{errors.synopsis}</div>}
      </div>

      {/* Cover */}
      <div className="form-group mb-4">
        <label>{intl.formatMessage({ id: 'CoverImage' })}</label>
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
              {intl.formatMessage({ id: 'ChangeCover' })}
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => openModal('cover')}
          >
            {intl.formatMessage({ id: 'AddCover' })}
          </button>
        )}
        {errors.cover && <div className="text-danger">{errors.cover}</div>}
      </div>

      {/* Rate */}
      <div className="form-group">
        {intl.formatMessage({ id: 'Rate' })}
          <StarRatings
            rating={story.rate}
            starRatedColor="gold"
            numberOfStars={5}
            name="rating"
            starDimension="20px"
            starSpacing="2px"
          />
      </div>

      {/* Functional (Level) */}
      <div className="form-group">
        <label htmlFor="functional">{intl.formatMessage({ id: 'Level' })}</label>
        <select
          id="functional"
          className="form-control"
          value={story.functional}
          onChange={(e) => handleChange('functional', e.target.value)}
        >
          <option value="1">{intl.formatMessage({ id: 'Level' })} 1</option>
          <option value="2">{intl.formatMessage({ id: 'Level' })} 2</option>
          <option value="3">{intl.formatMessage({ id: 'Level' })} 3</option>
        </select>
      </div>

      {/* Keywords */}
      <div className="form-group">
        <label htmlFor="keywords">{intl.formatMessage({ id: 'Keywords' })}</label>
        <textarea
          id="keywords"
          className={`form-control ${errors.keywords ? 'is-invalid' : ''}`}
          rows={3}
          value={story.keywords || ''}
          onChange={(e) => {
            handleChange('keywords', e.target.value);
            setErrors({ ...errors, keywords: e.target.value.trim() ? null : errors.keywords });
          }}
        ></textarea>
        {errors.keywords && <div className="invalid-feedback">{errors.keywords}</div>}
      </div>

      {/* Language */}
      <div className="form-group">
        <label htmlFor="language">{intl.formatMessage({ id: 'DetailsStory.Language' })}</label>
        <select
          id="language"
          className={`form-control ${errors.language ? 'is-invalid' : ''}`}
          value={story.language || ''}
          onChange={(e) => {
            handleChange('language', e.target.value);
            setErrors({ ...errors, language: e.target.value ? null : intl.formatMessage({ id: 'DetailsStory.Languageisrequired' }) });
          }}
        >
          <option value="">{intl.formatMessage({ id: 'DetailsStory.SelectLanguage' })}</option>
          <option value="en">{intl.formatMessage({ id: 'English' })}</option>
          <option value="es">{intl.formatMessage({ id: 'Spanish' })}</option>
          <option value="gr">{intl.formatMessage({ id: 'Greek' })}</option>
          <option value="it">{intl.formatMessage({ id: 'Italian' })}</option>
        </select>
        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
      </div>

      {/* Ages */}
      <div className="form-group">
        <label htmlFor="ages">{intl.formatMessage({ id: 'DetailsStory.Ages' })}</label>
        <select
          id="ages"
          className={`form-control ${errors.ages ? 'is-invalid' : ''}`}
          value={story.ages || ''}
          onChange={(e) => {
            handleChange('ages', e.target.value);
            setErrors({ ...errors, ages: e.target.value ? null : intl.formatMessage({ id: 'DetailsStory.Agerangeisrequired' }) });
          }}
        >
          <option value="">{intl.formatMessage({ id: 'DetailsStory.SelectAgeRange' })}</option>
          <option value="2-5">2-5</option>
          <option value="6-9">6-9</option>
          <option value="10-12">10-12</option>
          <option value="13-17">13-17</option>
        </select>
        {errors.ages && <div className="invalid-feedback">{errors.ages}</div>}
      </div>

      {/* Εικόνες */}
      <div className="form-group">
        <label>{intl.formatMessage({ id: 'Images' })}</label>
        {[...Array(7)].map((_, index) => {
          const imageField = `image${index + 1}` as keyof StoryDetails;
          const imageValue = story?.[imageField];

          return (
            <div key={index} className="mb-3 d-flex align-items-center">
              <label style={{ marginRight: '10px' }}>{intl.formatMessage({ id: 'Image' })} {index + 1}</label>
              {imageValue ? (
                <>
                  <img
                    src={imageValue as string}
                    alt={`Story ${index + 1}`}
                    className="img-thumbnail"
                    style={{ width: '100px', marginRight: '10px' }}
                  />
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => openModal(imageField)}
                  >
                    {intl.formatMessage({ id: 'ChangeImage' })}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleChange(imageField, null)} // Διαγράφουμε την εικόνα
                  >
                    {intl.formatMessage({ id: 'DeleteImage' })}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => openModal(imageField)}
                >
                  {intl.formatMessage({ id: 'AddImage' })}
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
        availableImages={imageUrls}
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

      {/* Κείμενα */}
      {[...Array(7)].map((_, index) => {
        const textField = `text${index + 1}` as keyof StoryDetails;
        return (
          <div key={index} className="form-group">
            <label htmlFor={textField}>{intl.formatMessage({ id: 'Text' })} {index + 1}</label>
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

      {/* Public Checkbox */}
      {/* <div className="form-check mt-6 mb-6 fs-2">
        <input
          id="public"
          type="checkbox"
          className="form-check-input"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label htmlFor="public" className="form-check-label">
        {intl.formatMessage({ id: 'MakePublic' })}
        </label>
      </div> */}

      {/* Buttons */}
      <div className="mt-4">
        <button className="btn btn-success me-2" onClick={handleSave}
          disabled={!hasChanges()} // Ανενεργό αν δεν έχουν γίνει αλλαγές
        >
          {intl.formatMessage({ id: 'Save' })}
        </button>
        <button className="btn btn-danger" onClick={handleCancel}>
          {intl.formatMessage({ id: 'Cancel' })}
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

import { StoryDetails } from '../core/_models'
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

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedStory: Image | null;
    storyDetails: StoryDetails;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, selectedStory, storyDetails }) => {
    if (!isOpen || !selectedStory || !storyDetails) return null;

    const modalStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        width: '80%',
        maxWidth: '800px',
        maxHeight: '90%',
        overflowY: 'auto',
    };

    const headerStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        borderRadius: '8px',
        marginBottom: '10px',
    };

    // Δημιουργούμε έναν πίνακα με τις εικόνες που δεν είναι undefined
    const images = [
        storyDetails.image1,
        storyDetails.image2,
        storyDetails.image3,
        storyDetails.image4,
        storyDetails.image5,
        storyDetails.image6,
        storyDetails.image7,
    ].filter((image) => image);

    return (
        <>
            <div style={modalStyle}>
                <h2 style={headerStyle}>{storyDetails.title}</h2>
                <p><strong>Author:</strong> {storyDetails.authorName}</p>
                <p><strong>Synopsis:</strong> {storyDetails.synopsis}</p>
                <p><strong>Rate:</strong> {storyDetails.rate}</p>
                <p><strong>Text:</strong></p>
                <ul>
                    {[storyDetails.text1, storyDetails.text2, storyDetails.text3, storyDetails.text4, storyDetails.text5, storyDetails.text6, storyDetails.text7]
                        .filter((text) => text) // Φιλτράρουμε τα `null`
                        .map((text, index) => (
                            <li key={index}>{text}</li>
                        ))}
                </ul>
                <div>
                    <h3>Images:</h3>
                    {images.map((image, index) => (
                        <img key={index} src={image??''} alt={`Story Image ${index + 1}`} style={imageStyle} />
                    ))}
                </div>
                <button onClick={onClose} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ff5c5c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Close
                </button>
            </div>
        </>
    );
};
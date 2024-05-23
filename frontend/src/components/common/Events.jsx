import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // Import date-fns for date formatting
import { IoCloseSharp } from "react-icons/io5";
import '../../events.css'; // Assuming you have a separate CSS file for styles
import Modal from '../../components/common/EventModal.jsx';
import ConfirmationModal from '../../components/common/ConfirmationModal.jsx'; // Create this component
import { FaRegTrashCan } from 'react-icons/fa6';

const Events = ({ sceneId, user, sceneName }) => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        user: user._id,
        username: user.username,
        sceneId: sceneId,
        sceneName: sceneName,
        title: '',
        picture: '',
        location: '',
        description: '',
        artists: [''],
        genre: '',
        url: '',
        eventDate: '', // Add event date to state
        eventTime: '' // Add event time to state
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // Add state for image preview
    const [img, setImg] = useState(null);
    const imgRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${sceneId}?page=${currentPage}&limit=10`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                setEvents(data.events);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvents();
    }, [sceneId, currentPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.description || !newEvent.location || !newEvent.genre || !newEvent.eventDate || !newEvent.eventTime) return;

        const formData = new FormData();
        formData.append('title', newEvent.title);
        formData.append('location', newEvent.location);
        formData.append('description', newEvent.description);
        formData.append('artists', JSON.stringify(newEvent.artists)); // Stringify the artists array
        formData.append('genre', newEvent.genre);
        formData.append('url', newEvent.url);
        formData.append('user', newEvent.user);
        formData.append('username', newEvent.username);
        formData.append('sceneId', newEvent.sceneId);
        formData.append('sceneName', newEvent.sceneName);
        formData.append('eventDate', newEvent.eventDate); // Append event date
        formData.append('eventTime', newEvent.eventTime); // Append event time

        if (img) {
            formData.append('picture', img);
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const event = await res.json();
            setEvents([...events, event]);
            setNewEvent({
                user: user._id,
                username: user.username,
                sceneId: sceneId,
                sceneName: sceneName,
                title: '',
                picture: '',
                location: '',
                description: '',
                artists: [''],
                genre: '',
                url: '',
                eventDate: '', // Reset event date
                eventTime: '' // Reset event time
            });
            setImagePreview(null); // Reset image preview
            setIsModalOpen(false); // Close the modal after creating event
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleArtistChange = (index, value) => {
        const newArtists = [...newEvent.artists];
        newArtists[index] = value;
        setNewEvent({ ...newEvent, artists: newArtists });
    };

    const addArtist = () => {
        setNewEvent({ ...newEvent, artists: [...newEvent.artists, ''] });
    };

    const removeArtist = (index) => {
        const newArtists = newEvent.artists.filter((_, i) => i !== index);
        setNewEvent({ ...newEvent, artists: newArtists });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewEvent({ ...newEvent, picture: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setImg(reader.result);
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const truncateText = (text = '', eventId, length = 100) => {
        if (text.length <= length) return text;

        const truncatedText = text.slice(0, length);
        const lastSpaceIndex = truncatedText.lastIndexOf(' ');
        const finalText = truncatedText.slice(0, lastSpaceIndex) + '...';

        return (
            <>
                {finalText}
                <span className="see-more-link" onClick={() => navigate(`/scenes/events/${eventId}`)}> see more</span>
            </>
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (eventId) => {
        setEventToDelete(eventId);
        setIsConfirmationModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/event/${eventToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            setEvents(events.filter(event => event._id !== eventToDelete));
            setIsConfirmationModalOpen(false);
            setEventToDelete(null);
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="events-container">
            <h2 className="events-title">{sceneName} Events</h2>
            {(user.userType === 'artist' || user.userType === 'admin') && (
                <div className="center-button-wrapper">
                    <button onClick={() => setIsModalOpen(true)} className="new-event-button">
                        Create a New Event
                    </button>
                </div>
            )}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="new-ad-form">
                    <h3 className='post-classifieds-title'>Create a New Event</h3>
                    <span className='flex text-sm mb-4'>Organize an event and let the local scene vibe with your creativity. Connect with like-minded individuals and bring your vision to life!</span>
                    <input
                        type="text"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="ad-input"
                        required
                    />
                    <input
                        type="file"
                        name="picture"
                        ref={imgRef}
                        onChange={handleImageChange}
                        className="ad-input"
                    />
                    {imagePreview && (
                        <div className='relative w-72 mx-auto'>
                            <IoCloseSharp
                                className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
                                onClick={() => {
                                    setImagePreview(null);
                                    imgRef.current.value = null;
                                }}
                            />
                            <img src={imagePreview} className='w-full mx-auto h-72 object-contain rounded' alt="Event"/>
                        </div>
                    )}
                    <input
                        type="text"
                        name="location"
                        value={newEvent.location}
                        onChange={handleInputChange}
                        placeholder="Location"
                        className="ad-input"
                        required
                    />
                    <input
                        type="date"
                        name="eventDate"
                        value={newEvent.eventDate}
                        onChange={handleInputChange}
                        className="ad-input"
                        required
                    />
                    <input
                        type="time"
                        name="eventTime"
                        value={newEvent.eventTime}
                        onChange={handleInputChange}
                        className="ad-input"
                        required
                    />
                    <textarea
                        name="description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="ad-textarea"
                        required
                    />
                    <select
                        name='genre'
                        className='flex-1 input border border-gray-700 rounded p-2 input-md'
                        value={newEvent.genre}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a Genre</option>
                        <option value="Metal">Metal</option>
                        <option value="Rock">Rock</option>
                        <option value="Pop">Pop</option>
                        <option value="Country">Country</option>
                        <option value="Blues">Blues</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Folk">Folk</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="text"
                        name="url"
                        value={newEvent.url}
                        onChange={handleInputChange}
                        placeholder="Event URL"
                        className="ad-input"
                    />
                    {newEvent.artists.map((artist, index) => (
                        <div key={index} className="artist-input">
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => handleArtistChange(index, e.target.value)}
                                placeholder={`Artist ${index + 1}`}
                                className="ad-input"
                            />
                            <button type="button" onClick={() => removeArtist(index)} className="remove-artist-button">
                                Remove
                            </button>
                        </div>
                    ))}
                    {newEvent.artists.length < 20 && (
                        <button type="button" onClick={addArtist} className="add-artist-button">
                            + Add Artist
                        </button>
                    )}
                    <button type="submit" className="ad-submit-button">Create Event</button>
                </form>
            </Modal>
            <div className="ads">
                {events.length === 0 ? (
                    <p className="no-ads">No events available. Artists can create events to get started!</p>
                ) : (
                    events.map((event) => (
                        <div key={event._id} className="ad" style={{ position: 'relative' }} onClick={() => navigate(`/scenes/events/${event._id}`)}>
                            <div className="ad-title">{event.title}</div>
                            <span className='text-gray-700 flex text-sm mb-4'>{formatDate(event.eventDate)} {formatTime(event.eventTime)}</span> {/* Display event date and time */}
                            {event.picture && (
                                <img src={event.picture} alt={event.title} className="event-thumbnail mb-5" />
                            )}
                            <p className='mb-5'>{truncateText(event.description, event._id)}</p>
                            {event.user === user._id && (
                                <button onClick={() => handleDeleteClick(event._id)} className="delete-icon">
                                    <FaRegTrashCan />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <ConfirmationModal
                show={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message="Are you sure you want to delete this event?"
            />
        </div>
    );
};

export default Events;

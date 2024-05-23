import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../classifieds.css'; // Use the same CSS file for styles

const EventDetail = ({ user }) => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/event/${eventId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                setEvent(data);
            } catch (error) {
                console.error('Failed to fetch event:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/comments/${eventId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                if (Array.isArray(data)) {
                    setComments(data);
                } else {
                    console.error('Comments data is not an array:', data);
                }
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchEvent();
        fetchComments();
    }, [eventId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/event/${eventId}/comments`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id, username: user.username, content: newComment, eventId: eventId }),
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status} ${res.statusText}`);
            }
            const comment = await res.json();
            setComments([...comments, comment]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
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

    if (!event) return <div>Loading...</div>;

    return (
        <div className="classified-ad-detail-container">
            <h2 className="classified-ad-title">{event.title}</h2>
            <div className="event-host-details">
                <span className='text-gray-700 flex gap-1 text-sm text-center mt-2'>
                    Hosted By: <Link to={`/profile/${event?.username}`} className='font-bold'>@{event?.username}</Link>
                </span>
                <div className='text-gray-700 flex gap-1 text-sm text-center mb-5'>
                    Artists: <span className='font-bold'>{event.artists.join(' | ')}</span> | Genre: <span className='font-bold'>{event.genre}</span>
                </div>
                <div className='text-gray-700 flex gap-1 text-sm text-center mb-5'>
                    <span className='font-bold'>{event.location}</span> | <span className='font-bold'>{formatDate(event.eventDate)}</span> | <span className='font-bold'>{formatTime(event.eventTime)}</span>
                </div>
            </div>
            {event.picture && (
                <div className="event-image-container">
                    <img src={event.picture} alt={event.title} className="event-image" />
                </div>
            )}
            <p className="event-description">{event.description}</p>
            <div className="comments">
                <h3 className="comments-title mt-10">Comments</h3>
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <div className='flex gap-2 items-start'>
                                <div className='flex flex-col'>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-gray-700 text-sm'>@{comment.username}</span>
                                    </div>
                                    <div className='text-sm'>{comment.content}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {user && (
                <form onSubmit={handleCommentSubmit} className="new-comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your comment here..."
                        className="comment-textarea"
                    />
                    <button type="submit" className="comment-submit-button">Post Comment</button>
                </form>
            )}
        </div>
    );
};

export default EventDetail;

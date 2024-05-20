import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../classifieds.css'; // Assuming you have a separate CSS file for styles

const ClassifiedAdDetail = ({ user }) => {
    const { adId } = useParams();
    const [ad, setAd] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classifieds/ad/${adId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                setAd(data);
            } catch (error) {
                console.error('Failed to fetch ad:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classifieds/ad/${adId}/comments`, {
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

        fetchAd();
        fetchComments();
    }, [adId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classifieds/ad/${adId}/comments`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id, username: user.username, content: newComment, adId: adId }),
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

    if (!ad) return <div>Loading...</div>;

    return (
        <div className="classified-ad-detail-container">
            <h2 className="classified-ad-title">{ad.title}</h2>
            <span className='text-gray-700 flex gap-1 text-sm text-center mt-2 mb-5'>*Posted By: <Link to={`/profile/${ad?.username}`} className='font-bold'>
                            @{ad?.username}
                        </Link></span>
            <p>{ad.description}</p>
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
                                        <span className='text-gray-700 text-sm'>
                                            @{comment.username}
                                        </span>
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

export default ClassifiedAdDetail;

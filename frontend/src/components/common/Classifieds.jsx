import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPostDate } from "../../utils/date";
import '../../classifieds.css'; // Assuming you have a separate CSS file for styles

const Classifieds = ({ sceneId, user, sceneName }) => {
    const [ads, setAds] = useState([]);
    const [newAd, setNewAd] = useState({ title: '', description: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classifieds/${sceneId}?page=${currentPage}&limit=10`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                setAds(data.ads);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAds();
    }, [sceneId, currentPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newAd.title || !newAd.description) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classifieds`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sceneId, userId: user._id, username: user.username, ...newAd }),
            });
            const ad = await res.json();
            setAds([...ads, ad]);
            setNewAd({ title: '', description: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const truncateText = (text, adId, length = 100) => {
        if (text.length <= length) return text;
        
        const truncatedText = text.slice(0, length);
        const lastSpaceIndex = truncatedText.lastIndexOf(' ');
        const finalText = truncatedText.slice(0, lastSpaceIndex) + '...';
        
        return (
            <>
                {finalText}
                <span className="see-more-link" onClick={() => navigate(`/scenes/classifieds/${adId}`)}> see more</span>
            </>
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="classifieds-container">
            <h2 className="classifieds-title">{sceneName} Classifieds</h2>
            {(user.userType === 'artist' || user.userType === 'admin') && (
                <form onSubmit={handleSubmit} className="new-ad-form mb-8">
                    <h3 className='post-classifieds-title'>Post a Classified Ad</h3>
                    <span className='flex text-sm mb-4'>Looking for a new member for your band? Or maybe you want to organize an event? Whatever the idea, post it here and let the local scene vibe with your creativity. Connect with like-minded individuals and bring your vision to life!</span>
                    <input
                        type="text"
                        value={newAd.title}
                        onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                        placeholder="Title"
                        className="ad-input"
                    />
                    <textarea
                        value={newAd.description}
                        onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                        placeholder="Description"
                        className="ad-textarea"
                    />
                    <button type="submit" className="ad-submit-button">Post Ad</button>
                </form>
            )}
            <div className="ads">
                {ads.length === 0 ? (
                    <p className="no-ads">No ads available. Artists can post ads to get started!</p>
                ) : (
                    ads.map((ad) => (
                        <div key={ad._id} className="ad">
                            <div className="ad-title" onClick={() => navigate(`/scenes/classifieds/${ad._id}`)}>{ad.title}</div>
                            <span className='text-gray-700 flex text-sm mb-4'>{formatPostDate(new Date(ad.createdAt))}</span>
                            <p>{truncateText(ad.description, ad._id)}</p>
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
        </div>
    );
};

export default Classifieds;

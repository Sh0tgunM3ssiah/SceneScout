import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../classifieds.css'; // Assuming you have a separate CSS file for styles

const Classifieds = ({ sceneId, user, sceneName }) => {
    const [ads, setAds] = useState([]);
    const [newAd, setNewAd] = useState({ title: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classifieds/${sceneId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                setAds(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAds();
    }, [sceneId]);

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

    return (
        <div className="classifieds-container">
            <h2 className="classifieds-title">{sceneName} Classifieds</h2>
            {user.userType === 'artist' && (
                <form onSubmit={handleSubmit} className="new-ad-form">
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
                        <div key={ad._id} className="ad" onClick={() => navigate(`/scenes/classifieds/${ad._id}`)}>
                            <div className="ad-title">{ad.title}</div>
                            <p>{ad.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Classifieds;

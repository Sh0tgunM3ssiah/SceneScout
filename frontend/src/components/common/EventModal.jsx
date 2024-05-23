import React from 'react';
import '../../eventModal.css';

const EventModal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="event-modal-overlay" onClick={handleOverlayClick}>
            <div className="event-modal-content">
                <button className="close" onClick={onClose}>&times;</button>
                {children}
            </div>
        </div>
    );
};

export default EventModal;

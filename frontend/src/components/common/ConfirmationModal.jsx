import React from 'react';
import '../../classifieds.css'; // Assuming you have a separate CSS file for styles

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="modal-body">
                    <p>{message}</p>
                    <div className="modal-actions">
                        <button onClick={onConfirm} className="confirm-button">Yes</button>
                        <button onClick={onClose} className="cancel-button">No</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

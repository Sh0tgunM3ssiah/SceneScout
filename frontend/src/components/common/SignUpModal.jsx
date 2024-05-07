import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the close (times) icon from react-icons

const Modal = ({ onClose, children, title }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center p-4">
            <div className="bg-black p-5 rounded-lg shadow-lg max-w-sm w-full relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-white hover:text-gray-500"
                    aria-label="Close modal"
                >
                    <FaTimes size={20} />  {/* Displaying the X icon */}
                </button>
                <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;
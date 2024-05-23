import React, { useEffect, useRef, useState } from 'react';
import '../../messageBoard.css'; // Assuming you have a separate CSS file for styles
import { formatPostDate } from "../../utils/date";

const MessageBoard = ({ sceneId, user, sceneName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messageBoard/${sceneId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) {
                    const errorText = await res.text(); // Read the error response as text
                    throw new Error(`Failed to fetch messages: ${errorText}`);
                }

                const data = await res.json();
                setMessages(data);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchMessages();
    }, [sceneId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messageBoard`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sceneId: sceneId, userId: user._id, username: user.username, content: newMessage }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to post message: ${errorText}`);
            }

            const message = await res.json();
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="message-board-container">
            <h2 className="message-board-title">{sceneName} Message Board</h2>
            <span className='text-gray-700 flex gap-1 text-sm text-center'>*This message board only displays the last 500 messages over the last 14 days. Any messages sent before this time period have been permanently erased.*</span>
            <div className="messages">
                {messages.length === 0 ? (
                    <p className="no-messages">
                        It's pretty quiet in here...if you are local to the {sceneName} scene, post a message to get the chat started!
                    </p>
                ) : (
                    messages.map((message) => (
                        <div key={message._id} className="message">
                            <a href={`/profile/${message.username}`} className="message-username"><strong>{message.username}</strong></a>: {message.content}
                            <span className='text-gray-700 flex gap-1 text-sm'>{formatPostDate(new Date(message.createdAt))}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            {user.sceneId === sceneId && (
                <form onSubmit={handleSubmit} className="new-message-form">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="message-textarea"
                    />
                    <button type="submit" className="message-submit-button">Post Message</button>
                </form>
            )}
        </div>
    );
};

export default MessageBoard;

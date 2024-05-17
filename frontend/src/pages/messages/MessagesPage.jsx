import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "../../components/common/ChatContainer";
import Contacts from "../../components/common/Contacts";
import { useQuery } from '@tanstack/react-query';
import { FaArrowLeft } from "react-icons/fa";

const MessagesPage = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [showChat, setShowChat] = useState(false);  // State to toggle between contacts and chat screen

  useEffect(() => {
    if (authUser) {
      socket.current = io(import.meta.env.VITE_BACKEND_URL);
      socket.current.emit("add-user", authUser._id);
    }
  }, [authUser]);

  useEffect(() => {
    async function fetchContacts() {
      if (authUser) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/following/${authUser._id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Something went wrong!");
          }
          setContacts(data);
        } catch (error) {
          console.error("Failed to fetch contacts:", error.message);
        }
      }
    }
    fetchContacts();
  }, [authUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setShowChat(true);  // Show the chat screen when a contact is selected
  };

  const handleBack = () => {
    setShowChat(false);  // Hide the chat screen and show contacts
  };

  return (
    <>
      <div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
        <div className='flex items-center p-4 border-b border-gray-700'>
          <Link to='/'>
            <FaArrowLeft className='w-4 h-4 mr-10' />
          </Link>
          <p className='font-bold'>Messages</p>
        </div>
        <StyledContainer>
          <div className="container">
            {!showChat ? (
              <Contacts contacts={contacts} changeChat={handleChatChange} />
            ) : (
              <ChatContainer currentChat={currentChat} socket={socket} authUser={authUser} handleBack={handleBack} />
            )}
          </div>
        </StyledContainer>
      </div>
    </>
  );
}

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  .container {
    height: 87vh;
    width: 100%;
    max-width: 85vw;
    display: grid;
    grid-template-columns: 100%;
    overflow: hidden;
    .avatar {
        img {
          border-radius: 50%;
        }
      }
  }
`;

export default MessagesPage;

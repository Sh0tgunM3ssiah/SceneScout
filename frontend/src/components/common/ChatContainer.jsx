import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import { FaArrowLeft } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const ChatContainer = ({ currentChat, socket, authUser, handleBack }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/getmsg`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            from: authUser._id,
            to: currentChat._id,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch messages.");
        }
        const messagesData = await response.json();
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    if (currentChat) {
      fetchData();
    }
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/addmsg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          from: authUser._id,
          to: currentChat._id,
          message: msg,
        }),
      });

      const msgs = [...messages, { fromSelf: true, message: msg }];
      setMessages(msgs);
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: authUser._id,
        msg,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <FaArrowLeft className='w-4 h-4 mr-10 cursor-pointer' onClick={handleBack} />
        <div className="user-details">
          <div className="avatar">
            <a href={`/profile/${currentChat.username}`}><img src={currentChat.profileImg || "/avatar-placeholder.png"} alt="Profile" /></a>
          </div>
          <div className="username">
            <a href={`/profile/${currentChat.username}`}><h3>{currentChat.username}</h3></a>
          </div>
          <div className="username">
            <FaLocationDot className="location-icon" /> {/* Icon added before the scene name */}
            <h3>{currentChat.sceneName}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${message.fromSelf ? "sended" : "recieved"}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
};

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    width: 100%;  // Ensure it takes the full width of its parent container
    overflow: hidden;  // Handle overflow to prevent spilling out
    gap: 0.1rem;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
    }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 2.5rem;
          border-radius: 50%;
        }
      }
      .username {
        display: flex;
        align-items: center; // Ensures that the icon and text are aligned
        gap: 0.1rem; // Provides some space between the icon and the text
      
        .location-icon {
          color: #your-color-choice; // Optional: change the icon color
          font-size: 1.2rem; // Optional: adjust the size of the icon
        }
        h3 {
            color: white;
          }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    overflow-y: auto;
    overflow-x: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;
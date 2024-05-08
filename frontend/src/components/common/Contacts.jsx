import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../../assets/logo.svg";
import { useQuery } from '@tanstack/react-query';
import { FaLocationDot } from "react-icons/fa6";

const Contacts = ({contacts, changeChat}) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(() => {
    async function updateUserInfo() {
      if (authUser) {
        setCurrentUserName(authUser.username);
        setCurrentUserImage(authUser.profileImage);
      }
    }
    updateUserInfo();
  }, [authUser]);  // Added dependency on authUser

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {authUser && (
        <Container>
          <div className="brand">
            {/* <img src={Logo} alt="logo" /> */}
            <h3>Following </h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                    key={contact._id}
                    className={`contact ${
                        index === currentSelected ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                    >
                    <div className="avatar">
                        <img src={contact.profileImg || "/avatar-placeholder.png"} alt="Profile" />
                    </div>
                    <div className="info-container">
                        <div className="username">
                        <h3>{contact.username}</h3>
                        </div>
                        <div className="scene">
                            <FaLocationDot className="location-icon" />
                            <h3>{contact.sceneName}</h3>
                        </div>
                    </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
                <img src={authUser.profileImg || "/avatar-placeholder.png"} alt="Profile" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #000000;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username, .scene {
        display: flex;
        align-items: center; // Aligns contents in the center vertically
        gap: 0.1rem; // Space between text and icon
      }

      .scene {
        .location-icon {
          font-size: 1.2rem;
          color: #your-color-choice; // Customize color
        }
        h3 {
          margin: 0; // Removes default margin that may cause misalignment
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
      
        h3 {
          color: white;
          text-transform: uppercase;
          display: flex;  // Ensure inline elements like text and span align properly
          align-items: center;
          gap: 0.2rem;  // Adjust spacing between title and copyright symbol
        }
      
        .copyright {
          font-size: 0.8rem;  // Optionally reduce the font size of the copyright symbol
        }
      }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;
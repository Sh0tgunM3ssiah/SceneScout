import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.id = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setFollowers: (state, action) => {
      if (state.user) {
        state.user.followers = action.payload.followers;
      } else {
        console.error("user followers non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    addPost: (state, action) => {
      // Prepend the new post so it appears at the top of the list
      state.posts = [action.payload, ...state.posts];
    },
    setEvents: (state, action) => {
      state.events = action.payload.events;
    },
    setEvent: (state, action) => {
      const updatedEvents = state.events.map((event) => {
        if (event._id === action.payload.event._id) return action.payload.event;
        return event;
      });
      state.events = updatedEvents;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setFollowers, setPosts, setPost, addPost, setEvents, setEvent } =
  authSlice.actions;
export default authSlice.reducer;

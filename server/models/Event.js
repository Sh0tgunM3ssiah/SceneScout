import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    venueName: {
      type: String,
    },
    location: String,
    description: String,
    sceneId: {
      type: String,
      required: true,
    },
    picturePath: String,
    bands: {
      type: Array,
      default: [],
    },
    genres: {
      type: Array,
      default: [],
    },
    ticketLink: {
      type: String,
    },
    facebookLink: {
      type: String,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", postSchema);

export default Event;

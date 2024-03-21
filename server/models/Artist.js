import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 100,
    },
    accountType: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 100,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    picturePath: {
      type: String,
      default: "",
    },
    scene: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
      default: [],
    },
    location: String,
    biography: {
      type: String,
      default: "",
      max: 1000,
    },
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

const Artist = mongoose.model("Artist", ArtistSchema);
export default Artist;
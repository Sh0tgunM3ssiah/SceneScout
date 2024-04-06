import { Int32 } from "mongodb";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 100,
    },
    genreId: Number,
  },
  { timestamps: true }
);

const Genre = mongoose.model("Genre", genreSchema);

export default Genre;

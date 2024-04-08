import { Int32 } from "mongodb";
import mongoose from "mongoose";

const subGenreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 100,
    },
    parentId: Number,
  },
  { timestamps: true }
);

const SubGenre = mongoose.model("SubGenre", subGenreSchema);

export default SubGenre;

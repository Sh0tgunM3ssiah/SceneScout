import mongoose from "mongoose";

const SceneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 100,
    },
    location: String,
    longitude: String,
    latitude: String,
    state: String,
  },
  { timestamps: true }
);

const Scene = mongoose.model("Scene", SceneSchema);
export default Scene;
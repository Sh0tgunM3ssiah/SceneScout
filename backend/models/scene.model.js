import mongoose from "mongoose";

const sceneSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		location: {
			type: String,
		},
		longitude: {
			type: String,
		},
		latitude: {
			type: String,
		},
		state: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Scene = mongoose.model("Scene", sceneSchema);

export default Scene;

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    sceneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scene', required: true },
    sceneName: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    picture: { type: String },
    location: { type: String, required: true },
    description: { type: String, required: true },
    artists: { type: [String] },
    genre: { type: String },
    url: { type: String },
    eventDate: { type: Date },
    eventTime: { type: String }, // Use String to store time in 'HH:MM' format
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;

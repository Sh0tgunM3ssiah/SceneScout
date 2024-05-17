// models/ClassifiedAd.model.js
import mongoose from 'mongoose';

const classifiedAdSchema = new mongoose.Schema({
    sceneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scene', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ClassifiedAd', classifiedAdSchema);

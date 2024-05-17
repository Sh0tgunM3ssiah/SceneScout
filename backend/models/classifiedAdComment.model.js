// models/ClassifiedAdComment.model.js
import mongoose from 'mongoose';

const classifiedAdCommentSchema = new mongoose.Schema({
    adId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassifiedAd', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ClassifiedAdComment', classifiedAdCommentSchema);

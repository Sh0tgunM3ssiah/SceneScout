// models/messageBoardMessage.model.js
import mongoose from 'mongoose';

const messageBoardMessageSchema = new mongoose.Schema({
    sceneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scene', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
},
{ timestamps: true });

messageBoardMessageSchema.post('save', async function() {
    const MessageBoardMessage = mongoose.model('MessageBoardMessage', messageBoardMessageSchema);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Delete messages older than 14 days
    await MessageBoardMessage.deleteMany({ createdAt: { $lt: fourteenDaysAgo } });

    // Check the count of remaining messages
    const messageCount = await MessageBoardMessage.countDocuments();

    // If more than 500 messages, delete the oldest ones to keep the count under 500
    if (messageCount > 500) {
        const messagesToDelete = messageCount - 500;
        const oldestMessages = await MessageBoardMessage.find()
            .sort({ createdAt: 1 }) // Sort by oldest first
            .limit(messagesToDelete)
            .select('_id'); // Only select the _id field

        const idsToDelete = oldestMessages.map(message => message._id);
        await MessageBoardMessage.deleteMany({ _id: { $in: idsToDelete } });
    }
});

export default mongoose.model('MessageBoardMessage', messageBoardMessageSchema);
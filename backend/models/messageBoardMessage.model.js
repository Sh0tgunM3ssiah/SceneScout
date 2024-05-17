// models/Message.js
import mongoose from 'mongoose';

const messageBoardMessageSchema = new mongoose.Schema(
    {
        sceneId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const MessageBoardMessage = mongoose.model('messageBoardMessage', messageBoardMessageSchema);

export default MessageBoardMessage;

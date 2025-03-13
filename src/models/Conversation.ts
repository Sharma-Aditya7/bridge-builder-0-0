import mongoose, { Schema, Document, Model } from 'mongoose';

interface IMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

interface IConversation extends Document {
  users: string[];
  topic: string;
  status: 'active' | 'resolved' | 'abandoned';
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: {
    type: String,
    required: true,
    enum: ['user1', 'user2', 'ai']
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ConversationSchema = new Schema<IConversation>(
  {
    users: [{
      type: String,
      required: true
    }],
    topic: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'abandoned'],
      default: 'active'
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

// Check if the model exists already before creating it
const Conversation = mongoose.models.Conversation as Model<IConversation> || 
  mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
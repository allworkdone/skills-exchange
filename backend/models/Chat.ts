import { Schema, model } from 'mongoose';
import { IChat, IMessage } from '../types/index';

const messageSchema = new Schema<IMessage>({
  sender: {
    type: String,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new Schema<IChat>(
  {
    users: [
      {
        type: String,
        ref: 'User',
        required: true,
      },
    ],
    exchange: {
      type: String,
      ref: 'Exchange',
      default: null,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export const Chat = model<IChat>('Chat', chatSchema);

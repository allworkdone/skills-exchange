import { Schema, model } from 'mongoose';
import { IExchange } from '../types/index';

const exchangeSchema = new Schema<IExchange>(
  {
    initiator: {
      type: String,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: String,
      ref: 'User',
      required: true,
    },
    initiatorSkill: {
      type: String,
      ref: 'Skill',
      required: true,
    },
    recipientSkill: {
      type: String,
      ref: 'Skill',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    initiatorRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    recipientRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    initiatorReview: {
      type: String,
      default: null,
    },
    recipientReview: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Exchange = model<IExchange>('Exchange', exchangeSchema);

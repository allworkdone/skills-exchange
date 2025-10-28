import { Schema, model } from 'mongoose';
import { IReview } from '../types/index';

const reviewSchema = new Schema<IReview>(
  {
    exchange: {
      type: String,
      ref: 'Exchange',
      required: true,
    },
    reviewer: {
      type: String,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: String,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview>('Review', reviewSchema);

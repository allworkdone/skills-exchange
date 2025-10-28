import { Schema, model } from 'mongoose';
import { IReview } from '../types/index';

const reviewSchema = new Schema<IReview>(
  {
    exchange: {
      type: Schema.Types.ObjectId,
      ref: 'Exchange',
      required: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: Schema.Types.ObjectId,
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

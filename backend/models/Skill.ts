import { Schema, model } from 'mongoose';
import { ISkill } from '../types/index';

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technology', 'Music', 'Creative', 'Language', 'Fitness', 'Culinary', 'Business', 'Crafts', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Skill = model<ISkill>('Skill', skillSchema);

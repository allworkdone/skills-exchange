import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: string;
 firstName: string;
 lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  skills: string[];
  exchanges: string[];
  reviews: string[];
 rating: number;
 createdAt: Date;
 updatedAt: Date;
 comparePassword(password: string): Promise<boolean>;
}

export interface ISkill extends Document {
  _id: string;
 name: string;
 category: SkillCategory;
  description: string;
  proficiencyLevel: ProficiencyLevel;
  user: string | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExchange extends Document {
  _id: string;
  initiator: string;
  recipient: string;
  initiatorSkill: string;
 recipientSkill: string;
 status: ExchangeStatus;
  message?: string;
  scheduledDate?: Date;
 completedDate?: Date;
  initiatorRating?: number;
  recipientRating?: number;
  initiatorReview?: string;
  recipientReview?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  _id: string;
  exchange: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IChat extends Document {
  _id: string;
  users: string[];
  exchange?: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  sender: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export type SkillCategory = 
  | 'Technology' 
  | 'Music' 
  | 'Creative' 
  | 'Language' 
  | 'Fitness' 
  | 'Culinary' 
  | 'Business' 
  | 'Crafts'
  | 'Other';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ExchangeStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'scheduled' 
  | 'completed' 
  | 'cancelled';

export interface IJWTPayload {
  userId: string;
  email: string;
}

export interface AuthRequest {
  userId?: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      email?: string;
    }
 }
}

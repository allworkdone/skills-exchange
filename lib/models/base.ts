// Base response model
export interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  data?: T;
  message?: string;
}

// Base user model
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  rating: number;
  skills?: string[];
  exchanges?: string[];
  reviews?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Base skill model
export interface Skill {
  _id: string;
  name: string;
  category: string;
  description: string;
  proficiencyLevel: string;
  user: string | User;
 createdAt?: string;
  updatedAt?: string;
}

// Base exchange model
export interface Exchange {
  _id: string;
  initiator: string | User;
  recipient: string | User;
  initiatorSkill: string | Skill;
  recipientSkill: string | Skill;
  status: 'pending' | 'accepted' | 'rejected' | 'scheduled' | 'completed' | 'cancelled';
  message?: string;
  scheduledDate?: string;
  completedDate?: string;
  initiatorRating?: number;
  recipientRating?: number;
  initiatorReview?: string;
 recipientReview?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Base chat model
export interface Chat {
  _id: string;
  users: Array<{ _id: string; firstName: string; lastName: string; profilePicture?: string }>;
  exchange?: { _id: string; status: string };
  messages: Array<{
    _id: string;
    sender: { _id: string; firstName: string; lastName: string };
    content: string;
    timestamp: string;
    read: boolean;
  }>;
  updatedAt: string;
}

// Base review model
export interface Review {
  _id: string;
 exchange: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

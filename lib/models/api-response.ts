import { User, Skill, Exchange, Chat, Review } from './base';

// Specific response models
export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

export interface GetUserResponse {
  user: User;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetSkillsResponse {
  skills: Skill[];
 total: number;
 limit: number;
 offset: number;
}

export interface GetExchangesResponse {
  exchanges: Exchange[];
}

export interface GetChatsResponse {
  chats: Chat[];
}

export interface GetChatResponse {
  chat: Chat;
}

export interface SendMessageResponse {
  chat: Chat;
}

export interface CreateExchangeResponse {
  exchange: Exchange;
}

export interface UpdateProfileResponse {
  user: User;
}

export interface SearchUsersResponse {
  users: User[];
}

export interface GetReviewsResponse {
  reviews: Review[];
}

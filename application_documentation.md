# Complete Application Documentation: Skill Exchange Platform

## Table of Contents
1. [Introduction](#introduction)
2. [Application Architecture Overview](#application-architecture-overview)
3. [Frontend Structure (Next.js App Router)](#frontend-structure-nextjs-app-router)
4. [Application Layout](#application-layout)
5. [Home Page](#home-page)
6. [Authentication Flow](#authentication-flow)
7. [User Dashboard](#user-dashboard)
8. [Profile Management](#profile-management)
9. [Admin Panel](#admin-panel)
10. [Chat System](#chat-system)
11. [Onboarding Process](#onboarding-process)
12. [Backend Structure](#backend-structure)
13. [API Routes and Controllers](#api-routes-and-controllers)
14. [Database Models](#database-models)
15. [Authentication System](#authentication-system)
16. [Skills and Exchanges Management](#skills-and-exchanges-management)
17. [Admin Functionality](#admin-functionality)
18. [Conclusion](#conclusion)

## Introduction

Welcome to the complete documentation for the Skill Exchange Platform! This application allows users to exchange skills with others, creating a community where people can learn from each other. The platform is built using modern web technologies including Next.js for the frontend and Node.js/Express for the backend.

This document is designed for beginners who want to understand how the application works from start to finish. We'll cover everything from the initial page load to how data flows between the frontend and backend.

## Application Architecture Overview

The Skill Exchange Platform follows a modern web application architecture with:

- **Frontend**: Next.js 13+ with App Router
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (as inferred from the project structure)
- **Authentication**: JWT-based authentication
- **UI Components**: Shadcn UI components
- **State Management**: React Context API

The application is organized in a monorepo structure with:
- `app/` directory: Contains the Next.js frontend with the App Router
- `backend/` directory: Contains the Node.js/Express backend server
- `components/` directory: Reusable UI components
- `contexts/` directory: Global state management

## Frontend Structure (Next.js App Router)

Next.js uses a file-based routing system called the App Router. This means that the file structure in the `app/` directory directly corresponds to the application's URL structure.

### Key Concepts for Beginners:

- **App Router**: A new routing system in Next.js 13+ that allows you to organize your application using folders and special files
- **Page**: A React component that represents a specific route in your application
- **Layout**: A component that wraps multiple pages and provides consistent structure
- **Server Components**: Components that run on the server, useful for data fetching
- **Client Components**: Components that run on the client, useful for interactivity

## Application Layout

Let's start with the main layout file: `app/layout.tsx`

The layout file is the foundation of your application. It defines the common structure that will be shared across all pages. When a user visits any page on the site, they will see the content from the layout file along with the specific page content.

Here's the actual layout file from the application:
```tsx
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/contexts/AuthContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SkillSwap - Exchange Skills, Build Community",
  description: "Connect with people in your area to trade skills without money.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

This layout ensures that every page in the application will have:
- A consistent HTML structure with proper metadata
- Custom fonts (Geist and Geist_Mono) for better typography
- Global CSS styles applied
- The navigation bar at the top
- Authentication context wrapping all pages
- The specific page content rendered in the main area

## Home Page

The home page is located at `app/page.tsx`. This is the first page users see when they visit the root URL of the application (e.g., https://yoursite.com).

The home page typically serves as an introduction to the application and provides pathways to other parts of the site. It might include:
- A hero section explaining the purpose of the platform
- Featured skills or popular exchanges
- Call-to-action buttons to register or log in
- Information about how the platform works

When a user visits the home page:
1. The Next.js framework loads the layout file first
2. Then it renders the specific content from `app/page.tsx`
3. Any data needed for the page is fetched (often on the server)
4. The complete page is sent to the user's browser

## Authentication Flow

The application has a complete authentication system with login and registration functionality.

### Login Page (`app/auth/login/page.tsx`)

When a user visits the login page:
1. They see a form with fields for email and password
2. When they submit the form, the frontend sends a request to the backend API
3. The backend validates the credentials against the database
4. If successful, the backend returns a JWT token
5. The frontend stores this token and redirects the user to their dashboard

Here's the actual implementation of the login page:
```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
 const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Login failed")
        return
      }

      login(data.user, data.token)
      toast.success("Login successful!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("An error occurred during login")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Welcome back to SkillSwap</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="•••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

This implementation includes:
- Form state management for email and password
- Client-side validation and error handling
- Integration with the AuthContext for login functionality
- Loading state to provide user feedback during authentication
- Toast notifications for success/error messages
- Navigation to the dashboard after successful login
- Links to the registration page for new users

### Registration Page (`app/auth/register/page.tsx`)

The registration page allows new users to create accounts:
1. Users fill out a registration form with their details
2. The frontend sends this information to the backend
3. The backend creates a new user in the database
4. The user is authenticated and redirected to complete onboarding

Here's the actual implementation of the registration page:
```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Registration failed")
        return
      }

      login(data.user, data.token)
      toast.success("Account created successfully!")
      router.push("/onboarding")
    } catch (error) {
      toast.error("An error occurred during registration")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join SkillSwap and start exchanging skills</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                name="location"
                placeholder="San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="•••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

This implementation includes:
- Form state management for user registration details (first name, last name, email, password, location)
- Client-side validation and error handling
- Integration with the AuthContext for login functionality after registration
- Loading state to provide user feedback during registration
- Toast notifications for success/error messages
- Navigation to the onboarding page after successful registration
- Links to the login page for existing users

### Authentication Context (`contexts/AuthContext.tsx`)

To maintain user authentication state across the application, the app uses React Context:
1. The AuthContext stores the current user's information and authentication status
2. Components throughout the app can access this context to check if a user is logged in
3. When a user logs in or out, the context updates and re-renders all components that depend on it

Here's the actual implementation of the AuthContext:
```tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  clearAuthData: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setToken(token);
 };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
 };

  const clearAuthData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, clearAuthData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

This implementation provides:
- State management for user authentication data
- Persistence using localStorage to maintain login status across sessions
- Error handling for invalid stored data
- Loading state to handle initial authentication checks
- Functions for login, logout, and clearing authentication data

## User Dashboard (`app/dashboard/page.tsx`)

The dashboard is the main hub for authenticated users. It provides:
- Overview of the user's skills
- Pending exchange requests
- Recent activity
- Quick links to other parts of the application

When a user accesses the dashboard:
1. The page checks if the user is authenticated using the AuthContext
2. If not authenticated, the user is redirected to the login page
3. If authenticated, the page fetches user-specific data from the backend
4. The dashboard content is displayed with personalized information

## Profile Management (`app/profile/[userId]/page.tsx`)

The profile page allows users to view and edit their profiles:
- The `[userId]` in the path is a dynamic route parameter
- This allows each user to have a unique profile URL
- The page fetches the specific user's information from the database
- Users can edit their own profiles, while others can view public information

## Admin Panel

The application includes an admin panel for managing the platform:
- `app/admin/page.tsx` - Main admin dashboard
- `app/admin/users/page.tsx` - Manage users
- `app/admin/skills/page.tsx` - Manage skills
- `app/admin/exchanges/page.tsx` - Manage exchanges

Admin functionality requires special permissions and includes:
- User management (view, edit, deactivate users)
- Skill management (approve, modify, remove skills)
- Exchange management (monitor, approve, modify exchanges)
- Platform analytics and insights

## Chat System (`app/chat/page.tsx`)

The chat system allows users to communicate about skill exchanges:
- Real-time messaging between users involved in exchanges
- Message history and notifications
- Integration with the exchange request system

## Onboarding Process (`app/onboarding/page.tsx`)

New users go through an onboarding process to set up their profiles:
- Add skills they want to teach
- Specify skills they want to learn
- Set up profile information
- Configure preferences

## Backend Structure

The backend is located in the `backend/` directory and is built with Node.js and Express.js.

### Server Entry Point (`backend/server.ts`)

The server file is where the backend application starts:
1. It connects to the database
2. Sets up middleware for handling requests
3. Defines routes for different API endpoints
4. Starts listening for incoming requests on a specific port

Here's the actual implementation of the backend server:

```ts
import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import skillRoutes from './routes/skills';
import exchangeRoutes from './routes/exchanges';
import chatRoutes from './routes/chats';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
 origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const activeUsers: Map<string, string> = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_online', (userId: string) => {
    activeUsers.set(socket.id, userId);
    io.emit('user_status_update', {
      userId,
      status: 'online',
    });
  });

  socket.on('join_chat', (chatId: string) => {
    socket.join(`chat_${chatId}`);
    io.to(`chat_${chatId}`).emit('user_joined', {
      userId: activeUsers.get(socket.id),
      chatId,
    });
  });

 socket.on('send_message', (data: any) => {
    io.to(`chat_${data.chatId}`).emit('new_message', {
      message: data.message,
      chatId: data.chatId,
      sender: activeUsers.get(socket.id),
    });
  });

  socket.on('typing', (data: any) => {
    io.to(`chat_${data.chatId}`).emit('user_typing', {
      userId: activeUsers.get(socket.id),
      chatId: data.chatId,
    });
  });

  socket.on('stop_typing', (data: any) => {
    io.to(`chat_${data.chatId}`).emit('user_stop_typing', {
      userId: activeUsers.get(socket.id),
      chatId: data.chatId,
    });
  });

  socket.on('disconnect', () => {
    const userId = activeUsers.get(socket.id);
    if (userId) {
      activeUsers.delete(socket.id);
      io.emit('user_status_update', {
        userId,
        status: 'offline',
      });
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date(),
  });
});

httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT} (${NODE_ENV})`);
});

export { io };
```

This server implementation includes:
- Environment configuration loading with dotenv
- Express.js server setup with CORS middleware
- Socket.IO for real-time communication (chat functionality)
- Database connection setup
- API route registration for different modules
- Real-time user status tracking (online/offline)
- Chat functionality with message sending and typing indicators
- Health check endpoint for monitoring
- Proper server startup with environment-specific configuration

### Configuration (`backend/config/database.ts`)

Database configuration handles the connection to MongoDB:
- Connection string management
- Connection pooling
- Error handling for database operations

## API Routes and Controllers

The backend uses a RESTful API architecture with routes and controllers:

### Authentication Routes (`backend/routes/auth.ts`)

Handles user authentication:
- Registration: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Get current user: `GET /api/auth/me`

### User Routes (`backend/routes/users.ts`)

Manages user-related operations:
- Get user profile: `GET /api/users/:id`
- Update user profile: `PUT /api/users/:id`
- Search users: `GET /api/users/search`

### Skills Routes (`backend/routes/skills.ts`)

Handles skill-related operations:
- Get all skills: `GET /api/skills`
- Create skill: `POST /api/skills`
- Update skill: `PUT /api/skills/:id`
- Delete skill: `DELETE /api/skills/:id`

### Exchanges Routes (`backend/routes/exchanges.ts`)

Manages skill exchange requests:
- Create exchange request: `POST /api/exchanges`
- Get user exchanges: `GET /api/exchanges/user`
- Update exchange status: `PUT /api/exchanges/:id`

### Chat Routes (`backend/routes/chats.ts`)

Handles messaging functionality:
- Get chat messages: `GET /api/chats/:exchangeId`
- Send message: `POST /api/chats/:exchangeId`

### Admin Routes (`backend/routes/admin.ts`)

Provides administrative functionality:
- Get all users: `GET /api/admin/users`
- Get all skills: `GET /api/admin/skills`
- Get all exchanges: `GET /api/admin/exchanges`
- Update user role: `PUT /api/admin/users/:id/role`

## Database Models

The application uses Mongoose ODM to interact with MongoDB. Models define the structure of data stored in the database:

### User Model (`backend/models/User.ts`)

Represents application users with fields like:
- Email and password (for authentication)
- Personal information (name, bio, avatar)
- Skills (teaching and learning)
- Role (user, admin)
- Created/updated timestamps

Here's the actual implementation of the User model:

```ts
import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';
import { IUser } from '../types/index';

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    exchanges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exchange',
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);
```

This model includes:
- Schema definition with validation rules for each field
- Password hashing using bcrypt before saving to database
- A method to compare passwords during authentication
- References to related models (skills, exchanges, reviews)
- Automatic timestamp generation for creation and updates

### Skill Model (`backend/models/Skill.ts`)

Represents skills that users can teach/learn:
- Skill name and description
- Category
- Created by user
- Approval status
- Creation timestamp

### Exchange Model (`backend/models/Exchange.ts`)

Represents skill exchange requests:
- Requesting user
- Receiving user
- Skills being exchanged
- Status (pending, accepted, completed, cancelled)
- Creation timestamp

### Chat Model (`backend/models/Chat.ts`)

Stores chat messages between users:
- Exchange reference
- Sender user
- Message content
- Timestamp
- Read status

## Authentication System

The application uses JWT (JSON Web Token) for authentication:

### How Authentication Works:

1. **Registration**: When a user registers, their password is hashed and stored in the database
2. **Login**: When a user logs in, their credentials are verified against the database
3. **Token Generation**: If credentials are valid, a JWT token is generated and returned to the frontend
4. **Token Storage**: The frontend stores this token (usually in localStorage or cookies)
5. **Subsequent Requests**: For protected routes, the frontend includes the token in the request headers
6. **Token Verification**: The backend verifies the token to ensure the user is authenticated

### Authentication Controller (`backend/controllers/authController.ts`)

The authentication controller handles user registration, login, and fetching current user information:

```ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, location } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      location: location || '',
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const login = async (req: Request, res: Response): Promise<void> => {
 try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString(), user.email);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        rating: user.rating,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId).populate('skills').populate('reviews');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
 } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};
```

This controller provides:
- Registration with validation and duplicate email checking
- Secure login with password comparison using bcrypt
- Current user retrieval with populated skills and reviews
- Proper error handling and status codes
- JWT token generation upon successful authentication

### Middleware (`backend/middleware/auth.ts`)

Authentication middleware is used to protect routes:
- It checks for the presence of a valid JWT token
- If valid, it adds user information to the request object
- If invalid, it returns an unauthorized error

### JWT Utilities (`backend/utils/jwt.ts`)

Contains functions for:
- Creating tokens when users log in
- Verifying tokens on protected routes
- Handling token expiration

## Skills and Exchanges Management

### Skills Controller (`backend/controllers/skillsController.ts`)

Handles all skill-related operations:
- Creating new skills
- Searching and filtering skills
- Updating skill information
- Deleting skills (with appropriate permissions)

### Exchanges Controller (`backend/controllers/exchangesController.ts`)

Manages the skill exchange process:
- Creating exchange requests between users
- Accepting or declining exchange requests
- Tracking exchange status
- Managing exchange completion

### Matching Algorithm (`backend/utils/matching.ts`)

Implements logic to help users find compatible skill exchange partners:
- Matches users based on skills they want to teach and learn
- Considers user preferences and availability
- Suggests potential exchange partners

## Admin Functionality

### Admin Controller (`backend/controllers/adminController.ts`)

Provides administrative capabilities:
- User management (view, edit, ban users)
- Skill moderation (approve, reject, edit skills)
- Exchange oversight (monitor, intervene in exchanges)
- Platform analytics and reporting

### Admin Middleware

Additional middleware ensures that only users with admin roles can access administrative functions:
- Checks user role in the database
- Verifies admin permissions
- Logs administrative actions for audit purposes

## Frontend-Backend Communication

The frontend and backend communicate through HTTP requests:

### API Route Handlers (`app/api/`)

Next.js API routes allow the frontend to communicate with the backend:
- `app/api/auth/register/route.ts` - Handles registration requests
- `app/api/auth/login/route.ts` - Handles login requests
- `app/api/auth/me/route.ts` - Gets current user information

These routes act as a bridge between the frontend and the backend, forwarding requests to the appropriate backend endpoints.

Let's look at the actual login API route handler:
```tsx
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    let body = null;

    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await request.json();
      }
    } catch (parseError) {
      console.error('Failed to parse JSON body:', parseError);
      body = {};
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

This API route handler:
- Forwards login requests from the frontend to the backend API
- Handles JSON parsing and error handling
- Uses the BACKEND_URL environment variable to determine the backend server location
- Maintains the same status code and response data from the backend
- Includes error logging for debugging purposes

### Component Integration

UI components use data from the backend:
- `SkillCard` components display skill information fetched from the API
- Forms submit data to backend endpoints
- Navigation changes based on user authentication status
- Real-time updates using polling or WebSocket connections

## Data Flow Example: Creating a Skill Exchange

Let's trace through the complete flow of creating a skill exchange:

1. **User Interface**: User clicks "Request Exchange" on a skill card
2. **Dialog Component**: `exchange-request-dialog.tsx` opens with a form
3. **Form Submission**: User fills out exchange details and submits
4. **API Call**: Frontend makes POST request to `/api/exchanges`
5. **Route Handler**: Next.js API route forwards to backend
6. **Controller Logic**: `exchangesController.ts` processes the request
7. **Database Operation**: New exchange record is created in MongoDB
8. **Response**: Success response is sent back to frontend
9. **UI Update**: Component updates to show success message
10. **Notification**: Other user is notified of the exchange request

## Security Considerations

The application implements several security measures:

- **Input Validation**: All user inputs are validated on both frontend and backend
- **Password Hashing**: Passwords are never stored in plain text
- **JWT Security**: Tokens have expiration times and are properly secured
- **Rate Limiting**: Prevents abuse of API endpoints
- **SQL Injection Prevention**: Uses parameterized queries
- **XSS Protection**: Sanitizes user inputs to prevent cross-site scripting

## Performance Optimization

The application includes performance optimizations:

- **Server-Side Rendering**: Critical content is rendered on the server for faster initial load
- **Client-Side Hydration**: Interactive features are added after initial render
- **Caching**: Frequently accessed data is cached to reduce database queries
- **Image Optimization**: Images are optimized for fast loading
- **Code Splitting**: JavaScript is split into smaller chunks for faster loading

## Conclusion

The Skill Exchange Platform is a comprehensive web application that demonstrates modern web development practices. It combines a Next.js frontend with a Node.js/Express backend to create a full-featured platform for skill exchange.

Key concepts covered in this documentation:
- Next.js App Router for routing and page structure
- React Context for state management
- JWT-based authentication system
- RESTful API design
- Database modeling with Mongoose
- Security best practices
- Component-based UI architecture

This application serves as an excellent example of how to build a complete, production-ready web application using modern technologies. The modular structure makes it easy to maintain and extend, while the security measures ensure user data is protected.

For beginners learning web development, this application demonstrates:
- How frontend and backend communicate
- How to structure a large application
- Best practices for authentication and security
- How to handle complex data relationships
- How to implement real-world features like chat and notifications

Understanding this application provides a solid foundation for building similar web applications and showcases industry-standard practices in modern web development.

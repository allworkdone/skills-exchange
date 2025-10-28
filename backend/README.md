# SkillSwap Backend

Node.js Express backend for the SkillSwap platform with MongoDB integration and real-time chat using Socket.io.

## Features

- User authentication with JWT
- Skill management and listing
- Smart skill matching algorithm
- Real-time chat with Socket.io
- Exchange request management
- Review and rating system
- Admin panel APIs
- RESTful API design

## Prerequisites

- Node.js (v16 or higher)
- MongoDB account (Neon or local MongoDB)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
ADMIN_ID=admin_user_id
```

## Running the Backend

Development mode:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (requires auth)
- `GET /api/skills/user` - Get user's skills (requires auth)
- `PUT /api/skills/:skillId` - Update skill (requires auth)
- `DELETE /api/skills/:skillId` - Delete skill (requires auth)

### Exchanges
- `GET /api/exchanges` - Get user's exchanges (requires auth)
- `POST /api/exchanges` - Request exchange (requires auth)
- `PUT /api/exchanges/:exchangeId` - Update exchange status (requires auth)
- `POST /api/exchanges/:exchangeId/review` - Submit review (requires auth)
- `GET /api/exchanges/matches` - Get matched users (requires auth)

### Chats
- `GET /api/chats` - Get all chats (requires auth)
- `GET /api/chats/:chatId` - Get specific chat (requires auth)
- `POST /api/chats/:chatId/messages` - Send message (requires auth)
- `PUT /api/chats/:chatId/read` - Mark messages as read (requires auth)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/search` - Search users
- `PUT /api/users/profile` - Update user profile (requires auth)

### Admin (requires admin access)
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/exchanges` - Get all exchanges
- `GET /api/admin/skills` - Get all skills

## Real-time Features (Socket.io)

Connected clients can listen to and emit events:

- `user_online` - Mark user as online
- `join_chat` - Join a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `user_status_update` - User online/offline status
- `new_message` - Receive new message
- `user_typing` - Another user is typing
- `user_joined` - User joined chat

## Database Schema

### User
- firstName, lastName, email, password (hashed)
- profilePicture, bio, location
- skills (array of skill IDs)
- exchanges (array of exchange IDs)
- reviews (array of review IDs)
- rating (average rating)

### Skill
- name, category, description, proficiencyLevel
- user (reference to User)

### Exchange
- initiator, recipient (User references)
- initiatorSkill, recipientSkill (Skill references)
- status, scheduledDate, completedDate
- ratings and reviews from both parties

### Chat
- users (array of 2 User references)
- exchange (optional Exchange reference)
- messages (array with sender, content, timestamp)

### Review
- exchange (Exchange reference)
- reviewer, reviewee (User references)
- rating (1-5), comment

## Development Notes

- All passwords are hashed with bcryptjs
- JWT tokens expire in 7 days
- Skill matching uses category and name similarity
- Average rating is calculated from all reviews
- Admin access controlled by ADMIN_ID environment variable

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

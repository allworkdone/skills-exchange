# LocalSkill Exchange Platform - Complete Setup Guide

A barter economy platform for skills where users can exchange skills directly without money. Build community by learning guitar from a teacher who wants a website built.

## 📋 Features

### Core Features
- ✅ User authentication with JWT and password hashing
- ✅ User profiles with skills and location
- ✅ Skill listing (what you offer + what you want to learn)
- ✅ Smart matching algorithm based on mutual skill needs
- ✅ Real-time chat for matched users with Socket.io
- ✅ Session scheduling and tracking
- ✅ Review/rating system after exchanges
- ✅ Admin dashboard for platform management

### Phase 2 Ready (Framework in place)
- 🔄 Video call integration for remote sessions
- 🔄 Skill verification badges
- �� "Skill credits" system for imbalanced exchanges
- 🔄 Community feed showing successful exchanges
- 🔄 AI-powered skill recommendations
- 🔄 Analytics dashboard showing learning journey

## 🏗️ Architecture

### Frontend (Next.js + React + Shadcn UI)
- Pages: Home, Auth, Dashboard, Profile, Browse, Chat, Admin Panel
- Real-time chat with Socket.io
- Responsive design with Tailwind CSS
- Form handling with react-hook-form and Zod validation

### Backend (Node.js + Express + TypeScript)
- RESTful API with JWT authentication
- MongoDB database with Mongoose ODM
- Real-time updates with Socket.io
- Admin APIs for platform management
- Smart skill matching algorithm

### Database (MongoDB)
- User accounts and profiles
- Skills with categories and proficiency levels
- Exchanges with status tracking
- Reviews and ratings
- Chat messages

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (using provided MongoDB URI)
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
```bash
npm install
cd backend && npm install && cd ..
```

2. **Configure environment variables:**

Frontend (`.env.local`):
```
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Backend (`backend/.env`):
```
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb+srv://allworkdone:allworkdone@cluster0.kanyoij.mongodb.net/skillswap
JWT_SECRET=your-jwt-secret-key-change-this-in-production
CLIENT_URL=http://localhost:3000
ADMIN_ID=admin_user_id_here
```

3. **Run the application:**

Option A - Run frontend and backend separately:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:backend
```

Option B - Run both together (requires concurrently):
```bash
npm install concurrently --save-dev
npm run dev:all
```

Frontend will be available at: `http://localhost:3000`
Backend API will be available at: `http://localhost:5000`

## 📱 Application Pages

### Public Pages
- `/` - Home page with featured skills
- `/auth/register` - User registration
- `/auth/login` - User login

### Authenticated Pages
- `/dashboard` - User dashboard with overview
- `/onboarding` - Add initial skills
- `/profile/[userId]` - View user profiles
- `/chat` - Real-time messaging
- `/matches` - Find skill matches

### Admin Pages (Admin only)
- `/admin` - Admin dashboard with analytics
- `/admin/users` - User management
- `/admin/skills` - Skill management
- `/admin/exchanges` - Exchange management

## 🔑 Key Features Explained

### Skill Matching Algorithm
Matches users based on:
1. Direct skill matches (exact name matching)
2. Category matches (same category)
3. Mutual benefit scoring
Sorted by match percentage

### Real-time Chat
- Socket.io integration for live messaging
- Online/offline status tracking
- Message read indicators
- Typing notifications

### Rating System
- Users rate each other after completing exchanges
- 1-5 star rating scale
- Average rating calculated from all completed exchanges
- Reviews stored with exchange details

### Admin Panel
- View platform statistics
- Monitor user activities
- Manage users, skills, and exchanges
- Access to top-rated users
- Recent exchange activity

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user (auth required)
```

### Skills Endpoints
```
GET /api/skills - Get all skills (with category/user filters)
POST /api/skills - Create skill (auth required)
GET /api/skills/user - Get user's skills (auth required)
PUT /api/skills/:skillId - Update skill (auth required)
DELETE /api/skills/:skillId - Delete skill (auth required)
```

### Exchanges Endpoints
```
GET /api/exchanges - Get user's exchanges (auth required)
POST /api/exchanges - Request exchange (auth required)
PUT /api/exchanges/:exchangeId - Update status (auth required)
POST /api/exchanges/:exchangeId/review - Submit review (auth required)
GET /api/exchanges/matches - Get matched users (auth required)
```

### Chat Endpoints
```
GET /api/chats - Get all chats (auth required)
GET /api/chats/:chatId - Get specific chat (auth required)
POST /api/chats/:chatId/messages - Send message (auth required)
PUT /api/chats/:chatId/read - Mark as read (auth required)
```

### User Endpoints
```
GET /api/users - Get all users (paginated)
GET /api/users/:userId - Get user profile
GET /api/users/search - Search users
PUT /api/users/profile - Update profile (auth required)
```

### Admin Endpoints
```
GET /api/admin/dashboard - Dashboard statistics
GET /api/admin/users - All users
GET /api/admin/users/:userId - User details
DELETE /api/admin/users/:userId - Delete user
GET /api/admin/exchanges - All exchanges
GET /api/admin/skills - All skills
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT authentication (7-day expiration)
- CORS enabled for specific origins
- Request validation with Zod
- MongoDB injection prevention with Mongoose
- XSS protection through React
- CSRF protection ready

## 🗄️ Database Schema

### User
```
{
  firstName, lastName, email, password (hashed)
  profilePicture, bio, location
  skills: [ObjectId]
  exchanges: [ObjectId]
  reviews: [ObjectId]
  rating: Number
  createdAt, updatedAt
}
```

### Skill
```
{
  name, category, description
  proficiencyLevel: Beginner/Intermediate/Advanced/Expert
  user: ObjectId
  createdAt, updatedAt
}
```

### Exchange
```
{
  initiator, recipient: ObjectId
  initiatorSkill, recipientSkill: ObjectId
  status: pending/accepted/rejected/scheduled/completed/cancelled
  scheduledDate, completedDate
  initiatorRating, recipientRating
  initiatorReview, recipientReview
  createdAt, updatedAt
}
```

## 🧪 Testing

### Test the application:

1. Register a new user
2. Add skills during onboarding
3. Browse available skills on home page
4. View user profiles
5. Request skill exchange
6. Chat with matched users
7. Complete exchange and leave review
8. Check admin dashboard for statistics

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
npm start
```

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your deployment platform
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Start: `npm start`

### Environment Variables for Production
```
MONGO_URL=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
PORT=5000
ADMIN_ID=your_admin_user_id
```

## 🛠️ Development Notes

### Adding New Features
1. Create MongoDB model in `backend/models/`
2. Create controller in `backend/controllers/`
3. Add routes in `backend/routes/`
4. Create API proxy in `app/api/`
5. Build frontend components/pages
6. Update admin panel if needed

### Project Structure
```
├── app/                    # Next.js app
│   ├── api/               # API routes/proxies
│   ├── auth/              # Auth pages
│   ├── dashboard/         # User dashboard
│   ├── chat/              # Chat page
│   ├── admin/             # Admin pages
│   └── page.tsx           # Home page
├── components/            # React components
├── backend/              # Express server
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & error handling
│   ├── utils/         # Helpers & algorithms
│   └── server.ts      # Main server file
├── public/             # Static files
└── styles/            # Global styles
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure port 5000 is available
- Check `.env` file exists with proper values

### Frontend can't connect to backend
- Verify `BACKEND_URL` in `.env.local`
- Check if backend is running on port 5000
- Check CORS settings in backend server

### Database errors
- Verify MongoDB credentials
- Check MongoDB cluster network access settings
- Ensure indexes are created

## 📞 Support

For issues or questions:
1. Check backend `README.md` for backend-specific setup
2. Check component files for UI implementation details
3. Review `.env` configuration
4. Check browser console for frontend errors
5. Check backend logs for API errors

## 📄 License

This project is open source and available for learning and personal use.

## 🎯 Next Steps

1. Deploy to production (Vercel + Railway/Heroku)
2. Set up MongoDB backup strategy
3. Implement email notifications
4. Add video call functionality (Phase 2)
5. Build community feed
6. Implement AI recommendations
7. Create analytics dashboard
8. Mobile app development

## 🤝 Contributing

To contribute improvements:
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

**Happy skill exchanging! 🚀**

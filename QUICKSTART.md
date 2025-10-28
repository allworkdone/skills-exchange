# SkillSwap - Quick Start Guide

Get the LocalSkill Exchange Platform running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- MongoDB connection string (provided: `mongodb+srv://allworkdone:allworkdone@cluster0.kanyoij.mongodb.net/`)

## 1️⃣ Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

## 2️⃣ Environment Setup

Frontend (`.env.local` already created):
```
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Backend (`backend/.env` already created):
```
PORT=5000
MONGO_URL=mongodb+srv://allworkdone:allworkdone@cluster0.kanyoij.mongodb.net/skillswap
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
ADMIN_ID=admin_user_id_here
```

## 3️⃣ Run the Application

**Option A: Run in separate terminals (recommended for development)**

Terminal 1 - Frontend:
```bash
npm run dev
# Opens http://localhost:3000
```

Terminal 2 - Backend:
```bash
npm run dev:backend
# API runs on http://localhost:5000
```

**Option B: Run both together**
```bash
npm run dev:all
```

## 4️⃣ First Steps

1. Open http://localhost:3000
2. Click "Get Started" or go to `/auth/register`
3. Create a new account
4. Add your skills during onboarding
5. Browse available skills on the home page
6. View other users' profiles
7. Request skill exchanges
8. Chat in real-time with matched users
9. Complete exchanges and leave reviews

## 📊 Test as Admin

To access admin dashboard:
1. Create a user account
2. Update `ADMIN_ID` in `backend/.env` to your user's ID (find in MongoDB)
3. Restart backend
4. Navigate to `/admin`

## 🔗 Important URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 📝 Test Data

**Default test skills categories:**
- Technology
- Music
- Creative
- Language
- Fitness
- Culinary
- Business
- Crafts
- Other

**Proficiency levels:**
- Beginner
- Intermediate
- Advanced
- Expert

## 🚀 Common Tasks

### Create a Skill
1. Go to Dashboard
2. Click "Add New Skill"
3. Fill in skill details
4. Add category and proficiency level

### Find Matches
1. Go to Home page
2. Browse skills and filter by category
3. Click "View Profile" on any skill card
4. Click "Request Exchange" to initiate

### Chat with User
1. Go to Messages in navbar
2. Select a conversation
3. Type and send messages
4. See typing indicators and online status

### View Admin Analytics
1. Go to /admin
2. View dashboard statistics
3. Manage users, skills, and exchanges
4. Monitor platform activity

## 🐛 Common Issues

**Backend won't start:**
- Check MongoDB connection
- Verify port 5000 is free
- Check `backend/.env` exists

**Frontend can't reach API:**
- Verify backend is running
- Check `BACKEND_URL` in `.env.local`
- Check browser console for errors

**Socket.io not connecting:**
- Verify backend is running with Socket.io
- Check firewall allows WebSocket connections

## 📚 Documentation

- **Full Setup:** See `PROJECT_SETUP.md`
- **Backend Details:** See `backend/README.md`
- **Deployment:** See `DEPLOYMENT.md`

## 🎯 Next Steps

1. Customize branding and colors
2. Add email notifications
3. Implement video calls
4. Deploy to production
5. Gather user feedback
6. Iterate and improve

## 💡 Tips

- Use mock data in the database for testing
- Set different JWT_SECRET in production
- Monitor MongoDB usage
- Keep Socket.io connections alive
- Test on mobile devices early

---

**Enjoy building your skill exchange community! 🚀**

Questions? Check the documentation files or review the backend README.

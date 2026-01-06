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

// For Vercel deployment, we need to conditionally handle the HTTP server
let httpServer: any;
let io: SocketIOServer | null = null;

// Only initialize Socket.IO in non-serverless environments
if (!process.env.VERCEL_ENV) {
  httpServer = createServer(app);
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
} else {
  // In Vercel environment, we'll use the express app directly
  // Note: Socket.IO functionality will not work in serverless environment
  httpServer = app;
}

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

// Only set up Socket.IO functionality if not in Vercel environment
if (io) {
  const activeUsers: Map<string, string> = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('user_online', (userId: string) => {
      activeUsers.set(socket.id, userId);
      console.log(`User online: ${userId}`);
      io?.emit('user_status_update', {
        userId,
        status: 'online',
      });
    });

    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat_${chatId}`);
      io?.to(`chat_${chatId}`).emit('user_joined', {
        userId: activeUsers.get(socket.id),
        chatId,
      });
    });

    socket.on('send_message', (data: any) => {
      // Emit the message to other users in the chat
      io?.to(`chat_${data.chatId}`).emit('new_message', {
        message: data.message,
        chatId: data.chatId,
        sender: activeUsers.get(socket.id),
      });
    });

    socket.on('typing', (data: any) => {
      io?.to(`chat_${data.chatId}`).emit('user_typing', {
        userId: activeUsers.get(socket.id),
        chatId: data.chatId,
      });
    });

    socket.on('stop_typing', (data: any) => {
      io?.to(`chat_${data.chatId}`).emit('user_stop_typing', {
        userId: activeUsers.get(socket.id),
        chatId: data.chatId,
      });
    });

    socket.on('disconnect', () => {
      const userId = activeUsers.get(socket.id);
      if (userId) {
        activeUsers.delete(socket.id);
        io?.emit('user_status_update', {
          userId,
          status: 'offline',
        });
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date(),
  });
});

// Export for Vercel serverless functions
export default app;

// For local development
if (!process.env.VERCEL_ENV) {
  httpServer.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT} (${NODE_ENV})`);
  });
}

// Export io for use in other modules when not in Vercel environment
export { io };
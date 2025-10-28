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

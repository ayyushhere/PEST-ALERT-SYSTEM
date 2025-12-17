import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

// --- IMPORTS ---
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// --- SOCKET.IO ---
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Client disconnected:', socket.id));
});
app.set('socketio', io);

// --- MOUNT ROUTES ---
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes); // <--- THIS LINE WAS LIKELY MISSING

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- SEED ADMIN SCRIPT ---
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@agrishield.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('👑 Default Admin Account Created');
    }
  } catch (error) {
    console.error('❌ Admin Seed Error:', error);
  }
};
seedAdmin();

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
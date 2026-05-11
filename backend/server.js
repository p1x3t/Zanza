import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import establishmentRoutes from './routes/establishments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'dev-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/establishments', establishmentRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Inicialização
async function start() {
  global.db = await initDatabase();
  console.log('Database initialized');
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(console.error);
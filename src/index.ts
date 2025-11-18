import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import { registerPostRoutes } from './routes/posts.js';
import { registerChatbotRoutes } from './routes/chatbot.js';
import './jobs/scheduler.js'; // load cron

const app = express();
app.use(express.json());

// CORS middleware (for Lynx/RN app)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      posts: '/api/posts',
      hotels: '/api/hotels',
      chat: '/api/chat',
      createPost: '/api/posts/create',
      socialMediaLinks: '/api/posts/:id/social-media'
    }
  });
});

registerPostRoutes(app);
registerChatbotRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on ${port}`));

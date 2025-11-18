import 'dotenv/config';
import express, {} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { registerPostRoutes } from './routes/posts.js';
import { registerChatbotRoutes } from './routes/chatbot.js';
import './jobs/scheduler.js';
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
// Parse JSON with size limit to prevent abuse
app.use(express.json({ limit: '1mb' }));
// Standard security headers
app.use(helmet());
// Prevent HTTP Parameter Pollution
app.use(hpp());
// CORS configuration (allowlist from env, fallback to '*')
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(s => s.trim()).filter(Boolean) ?? '*';
app.use(cors({ origin: allowedOrigins }));
// Basic rate limiting for all API endpoints
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);
// Preflight handler for legacy clients
app.use((req, res, next) => {
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
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});
//# sourceMappingURL=index.js.map
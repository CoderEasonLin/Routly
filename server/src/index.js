import express from 'express';
import cors from 'cors';
import workspaceRoutes from './api/workspace.js';
import fileRoutes from './api/file.js';
import gitRoutes from './api/git.js';
import httpRoutes from './api/http.js';
import dialogRoutes from './api/dialog.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/workspace', workspaceRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/git', gitRoutes);
app.use('/api/http', httpRoutes);
app.use('/api/dialog', dialogRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message, err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'UNKNOWN_ERROR',
  });
});

app.listen(PORT, () => {
  console.log(`Routly server running at http://localhost:${PORT}`);
});

export default app;

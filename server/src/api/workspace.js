import { Router } from 'express';
import path from 'path';
import { buildTree } from '../core/storage/index.js';
import { gitStatus } from '../core/git/index.js';

const router = Router();

/** GET /api/workspace/tree?path=... */
router.get('/tree', async (req, res, next) => {
  try {
    const { path: wsPath } = req.query;
    if (!wsPath) return res.status(400).json({ error: 'path query param required' });
    const children = await buildTree(wsPath, wsPath);
    const name = path.basename(wsPath);
    res.json({ name, type: 'directory', path: wsPath, children });
  } catch (err) {
    next(err);
  }
});

/** GET /api/workspace/status?path=... */
router.get('/status', async (req, res, next) => {
  try {
    const { path: wsPath } = req.query;
    if (!wsPath) return res.status(400).json({ error: 'path query param required' });
    const status = await gitStatus(wsPath);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

export default router;

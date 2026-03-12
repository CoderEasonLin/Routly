import { Router } from 'express';
import { gitStatus, gitAdd, gitCommit, gitLog, gitPush, gitPull, gitBranches } from '../core/git/index.js';

const router = Router();

/** GET /api/git/log?path=&limit= */
router.get('/log', async (req, res, next) => {
  try {
    const { path: wsPath, limit } = req.query;
    if (!wsPath) return res.status(400).json({ error: 'path required' });
    const log = await gitLog(wsPath, limit ? parseInt(limit) : 20);
    res.json(log);
  } catch (err) {
    next(err);
  }
});

/** GET /api/git/branches?path= */
router.get('/branches', async (req, res, next) => {
  try {
    const { path: wsPath } = req.query;
    if (!wsPath) return res.status(400).json({ error: 'path required' });
    const branches = await gitBranches(wsPath);
    res.json(branches);
  } catch (err) {
    next(err);
  }
});

/** POST /api/git/commit  body: { path, message } */
router.post('/commit', async (req, res, next) => {
  try {
    const { path: wsPath, message } = req.body;
    if (!wsPath || !message) return res.status(400).json({ error: 'path and message required' });
    await gitAdd(wsPath);
    const output = await gitCommit(wsPath, message);
    const hashMatch = output.match(/\[[\w\s]+\s([a-f0-9]{7,})/);
    res.json({ success: true, hash: hashMatch ? hashMatch[1] : null, output });
  } catch (err) {
    next(err);
  }
});

/** POST /api/git/push  body: { path } */
router.post('/push', async (req, res, next) => {
  try {
    const { path: wsPath } = req.body;
    if (!wsPath) return res.status(400).json({ error: 'path required' });
    const output = await gitPush(wsPath);
    res.json({ success: true, output });
  } catch (err) {
    next(err);
  }
});

/** POST /api/git/pull  body: { path } */
router.post('/pull', async (req, res, next) => {
  try {
    const { path: wsPath } = req.body;
    if (!wsPath) return res.status(400).json({ error: 'path required' });
    const output = await gitPull(wsPath);
    res.json({ success: true, output });
  } catch (err) {
    next(err);
  }
});

export default router;

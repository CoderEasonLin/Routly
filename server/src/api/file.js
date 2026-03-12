import { Router } from 'express';
import path from 'path';
import { readFile, writeFile } from '../core/storage/index.js';

const router = Router();

/** GET /api/file/read?path=... */
router.get('/read', async (req, res, next) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) return res.status(400).json({ error: 'path query param required' });
    const data = await readFile(filePath);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/** POST /api/file/write  body: { path, content } */
router.post('/write', async (req, res, next) => {
  try {
    const { path: filePath, content } = req.body;
    if (!filePath || content === undefined)
      return res.status(400).json({ error: 'path and content required' });
    await writeFile(filePath, content);
    res.json({ success: true, path: filePath });
  } catch (err) {
    next(err);
  }
});

export default router;

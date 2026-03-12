import { Router } from 'express';
import { executeRequest } from '../core/http/index.js';

const router = Router();

/** POST /api/http/execute
 *  body: { method, url, headers, body }
 */
router.post('/execute', async (req, res, next) => {
  try {
    const { method = 'GET', url, headers = {}, body = null } = req.body;
    if (!url) return res.status(400).json({ error: 'url required' });

    const result = await executeRequest({
      method,
      resolvedUrl: url,
      resolvedHeaders: headers,
      body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null,
    });
    res.json(result);
  } catch (err) {
    // Re-attach a proper HTTP status for network errors
    err.status = 502;
    err.code = 'REQUEST_FAILED';
    next(err);
  }
});

export default router;

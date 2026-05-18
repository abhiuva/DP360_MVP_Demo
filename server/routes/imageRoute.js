import express from 'express';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REMOTE_ADMIN_BASE_URL = process.env.REMOTE_IMAGE_BASE || "";

router.get('/public/:tenant/:id', async (req, res) => {
  const { tenant, id } = req.params;
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];

  const localBase = path.resolve('uploads/menu_items', tenant);

  // 1. Try locally stored images
  for (const ext of extensions) {
    const localPath = path.join(localBase, `${id}.${ext}`);
    if (fs.existsSync(localPath)) {
      return res.sendFile(localPath);
    }
  }

  // 2. Try fetching from a configured admin server.
  if (REMOTE_ADMIN_BASE_URL) {
    for (const ext of extensions) {
      const remoteUrl = `${REMOTE_ADMIN_BASE_URL}/public/${tenant}/${id}.${ext}`;
      try {
        const response = await axios.get(remoteUrl, { responseType: 'arraybuffer' });
        res.set('Content-Type', response.headers['content-type']);
        return res.send(response.data);
      } catch (e) {
        // Skip to next extension
      }
    }
  }

  // 3. Fallback
return res.status(404).json({ error: "Image not found" });
});

export default router;

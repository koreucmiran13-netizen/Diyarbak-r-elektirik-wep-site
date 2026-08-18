import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3002;
const host = '0.0.0.0';

app.use(cors());
app.use(express.json());

// API health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', domain: 'diyarbakirelektrikustasi.com.tr' });
});

// Vite Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' || 
                 fs.existsSync(path.join(process.cwd(), 'dist', 'index.html')) ||
                 fs.existsSync(path.join(__dirname, 'index.html'));
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(__dirname, 'index.html')) 
      ? __dirname 
      : path.join(process.cwd(), 'dist');
      
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, host, () => {
    console.log(`Diyarbakir Elektrik Ustasi running at http://${host}:${port}`);
  });
}

startServer();

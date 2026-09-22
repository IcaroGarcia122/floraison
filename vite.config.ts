import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function chatwootProxyPlugin(): Plugin {
  return {
    name: 'chatwoot-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chatwoot', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
          const targetUrl = urlObj.searchParams.get('endpoint');
          const token = (req.headers['api_access_token'] || req.headers['authorization'] || '') as string;

          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing endpoint parameter' }));
            return;
          }

          const cleanToken = token.replace(/^Bearer\s+/i, '');
          
          let bodyData: any = undefined;
          if (req.method && ['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            bodyData = Buffer.concat(chunks).toString();
          }

          const response = await fetch(targetUrl, {
            method: req.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              'api_access_token': cleanToken,
            },
            body: bodyData,
          });

          const data = await response.text();
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(data);
        } catch (err: unknown) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Chatwoot proxy failed' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), chatwootProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

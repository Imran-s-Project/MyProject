#!/usr/bin/env node
/**
 * dev-server.mjs — zero-dependency static server for local development.
 *
 *   node tools/dev-server.mjs            → http://localhost:8080
 *   node tools/dev-server.mjs 3000       → another port
 *
 * Why not `python3 -m http.server`? It does not support HTTP Range requests, and Safari (and
 * Chrome when seeking/looping) need Range to play <video>. Vercel and every real static host
 * support it, so this keeps local behaviour identical to production.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 8080);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.webm': 'video/webm', '.mp4': 'video/mp4',
  '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8'
};

http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      return void res.writeHead(400, { 'content-type': 'text/plain' }).end('400 bad request');
    }
    if (pathname.includes('\0')) return void res.writeHead(400, { 'content-type': 'text/plain' }).end('400 bad request');
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.join(root, pathname);
    if (!file.startsWith(root + path.sep) && file !== root) return void res.writeHead(403).end('Forbidden');
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) return void res.writeHead(404, { 'content-type': 'text/plain' }).end(`404 ${pathname}`);
      const base = { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'accept-ranges': 'bytes', 'cache-control': 'no-cache' };
      const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
      if (range) {
        const start = range[1] ? parseInt(range[1], 10) : 0;
        const end = Math.min(range[2] ? parseInt(range[2], 10) : st.size - 1, st.size - 1);
        if (start >= st.size || start > end) return void res.writeHead(416, { 'content-range': `bytes */${st.size}` }).end();
        res.writeHead(206, { ...base, 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1 });
        fs.createReadStream(file, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { ...base, 'content-length': st.size });
        fs.createReadStream(file).pipe(res);
      }
    });
  })
  .listen(port, () => console.log(`Serving ${root}\n→ http://localhost:${port}`));

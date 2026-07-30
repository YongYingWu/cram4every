#!/usr/bin/env node
/**
 * 本地静态服务器 + CORS 代理
 *
 * 用途：让刷题网页的"链接解析"功能可以直接抓取星光公考解析页，
 *       不依赖公共代理（公共代理经常不可用）。
 *
 * 用法：
 *   node tools/proxy-server.js          # 默认端口 8322
 *   PORT=9000 node tools/proxy-server.js
 *
 * 然后打开 http://localhost:8322 使用系统。
 * 解析器会优先尝试 /proxy?url=...（本服务提供），失败才退回公共代理。
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 8322;
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

function proxyFetch(targetUrl, res, redirects = 0) {
  if (redirects > 5) { res.writeHead(502); res.end('too many redirects'); return; }
  let u;
  try { u = new URL(targetUrl); } catch { res.writeHead(400); res.end('bad url'); return; }
  const mod = u.protocol === 'https:' ? https : http;
  const req = mod.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }, (up) => {
    if ([301, 302, 303, 307, 308].includes(up.statusCode) && up.headers.location) {
      up.resume();
      return proxyFetch(new URL(up.headers.location, u).href, res, redirects + 1);
    }
    res.writeHead(up.statusCode || 502, {
      'Content-Type': up.headers['content-type'] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    up.pipe(res);
  });
  req.on('timeout', () => { req.destroy(); res.writeHead(504); res.end('upstream timeout'); });
  req.on('error', (e) => { res.writeHead(502); res.end('proxy error: ' + e.message); });
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/proxy') {
    const target = u.searchParams.get('url');
    if (!target) { res.writeHead(400); res.end('missing url param'); return; }
    return proxyFetch(target, res);
  }
  // static files
  let p = path.normalize(decodeURIComponent(u.pathname));
  if (p === '/' || p === '\\') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`刷题系统（含本地代理）: http://localhost:${PORT}`);
  console.log(`代理接口: http://localhost:${PORT}/proxy?url=<目标URL>`);
});

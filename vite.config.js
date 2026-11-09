import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'

const CONTENT_FILE = path.resolve('src/content.json')
const UPLOAD_DIR = path.resolve('public/uploads')
const IMAGE_TYPES = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })

const sendJson = (res, status, body) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

// Owner-only editor backend. `apply: 'serve'` means it exists only while running
// `npm run dev` on your own machine; `npm run build` leaves it out entirely, so the
// public site is read-only.
function adminPlugin() {
  return {
    name: 'portfolio-admin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__admin', async (req, res) => {
        try {
          // Only accept requests from this computer
          const ip = req.socket.remoteAddress || ''
          if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip)) {
            return sendJson(res, 403, { error: 'Admin is only available on localhost' })
          }

          if (req.method === 'GET' && req.url === '/content') {
            return sendJson(res, 200, JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')))
          }

          if (req.method === 'POST' && req.url === '/content') {
            const content = JSON.parse(await readBody(req))
            fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2) + '\n')
            return sendJson(res, 200, { ok: true })
          }

          // Body: { name: "photo.png", data: "<base64>" } -> saved to public/uploads/
          if (req.method === 'POST' && req.url === '/upload') {
            const { name, data } = JSON.parse(await readBody(req))
            const ext = path.extname(name || '').toLowerCase()
            if (!IMAGE_TYPES.includes(ext)) {
              return sendJson(res, 400, { error: 'Only image files can be uploaded' })
            }
            const base = path
              .basename(name, ext)
              .replace(/[^a-z0-9-_]+/gi, '-')
              .slice(0, 50) || 'image'
            const fileName = `${base}-${Date.now()}${ext}`
            fs.mkdirSync(UPLOAD_DIR, { recursive: true })
            fs.writeFileSync(path.join(UPLOAD_DIR, fileName), Buffer.from(data, 'base64'))
            return sendJson(res, 200, { url: `/uploads/${fileName}` })
          }

          sendJson(res, 404, { error: 'Not found' })
        } catch (err) {
          sendJson(res, 500, { error: err.message })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    adminPlugin(),
  ],
})

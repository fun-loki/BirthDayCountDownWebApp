import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Proxy `/api` only when explicitly requested. Do not default to port 3000:
 * `vercel dev` runs `vite --port $PORT` (often 3000) but typically does **not**
 * set `process.env.PORT`, so guessing the dev port was wrong and the proxy
 * targeted the same server as Vite — `/api` bounced back into Vite, sometimes
 * returned `index.html`, and import-analysis tried to parse HTML as JS.
 *
 * Split-terminal workflow: `VITE_API_PROXY_TARGET=http://127.0.0.1:3000 npm run dev`
 * (use the port shown by `vercel dev`).
 */
function apiProxy():
  | Record<string, { target: string; changeOrigin: boolean }>
  | undefined {
  const target = process.env.VITE_API_PROXY_TARGET?.trim()
  if (!target) return undefined
  return {
    '/api': { target, changeOrigin: true },
  }
}

const proxy = apiProxy()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    ...(proxy ? { proxy } : {}),
  },
})

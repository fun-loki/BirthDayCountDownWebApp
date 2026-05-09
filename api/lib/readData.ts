import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const roots = () => [join(process.cwd(), 'public'), join(process.cwd(), 'dist')]

export function readPublicRelative(rel: string): string {
  for (const root of roots()) {
    const full = join(root, rel)
    if (existsSync(full)) return readFileSync(full, 'utf8')
  }
  throw new Error(`Missing static file: ${rel} (tried public/ and dist/)`)
}

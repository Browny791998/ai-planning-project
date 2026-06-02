import { Liveblocks } from '@liveblocks/node'

const CURSOR_COLORS = [
  '#F87171', // red
  '#FB923C', // orange
  '#FBBF24', // amber
  '#A3E635', // lime
  '#34D399', // emerald
  '#22D3EE', // cyan
  '#60A5FA', // blue
  '#A78BFA', // violet
  '#F472B6', // pink
]

export function userIdToColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length]
}

declare global {
  // eslint-disable-next-line no-var
  var liveblocksGlobal: Liveblocks | undefined
}

export function getLiveblocks(): Liveblocks {
  if (globalThis.liveblocksGlobal) return globalThis.liveblocksGlobal
  const secret = process.env.LIVEBLOCKS_SECRET_KEY
  if (!secret) throw new Error('LIVEBLOCKS_SECRET_KEY is not set')
  globalThis.liveblocksGlobal = new Liveblocks({ secret })
  return globalThis.liveblocksGlobal
}

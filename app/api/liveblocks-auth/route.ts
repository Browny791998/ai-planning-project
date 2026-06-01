import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentIdentity, getProjectWithAccess } from '@/lib/project-access'
import { getLiveblocks, userIdToColor } from '@/lib/liveblocks'

export async function POST(request: NextRequest) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const roomId: string | undefined = body?.room
  if (!roomId) {
    return NextResponse.json({ error: 'Missing room' }, { status: 400 })
  }

  const project = await getProjectWithAccess(roomId, identity)
  if (!project) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const user = await currentUser()
  const name =
    user?.fullName ??
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    'Anonymous'
  const avatar = user?.imageUrl ?? ''
  const color = userIdToColor(identity.userId)

  const liveblocks = getLiveblocks()

  await liveblocks.getOrCreateRoom(roomId, { defaultAccesses: [] })

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: { name, avatar, color },
  })
  session.allow(roomId, session.FULL_ACCESS)

  const { body: token, status } = await session.authorize()
  return new NextResponse(token, { status })
}

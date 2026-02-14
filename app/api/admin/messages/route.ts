import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

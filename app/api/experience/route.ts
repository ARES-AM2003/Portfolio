import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: {
        startDate: 'desc',
      },
    })
    
    return NextResponse.json(experience)
  } catch (error) {
    console.error('Experience fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const experience = await prisma.experience.create({
      data: {
        ...data,
      },
    })
    
    return NextResponse.json(experience)
  } catch (error) {
    console.error('Experience create error:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}

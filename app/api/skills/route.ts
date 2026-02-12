import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        technologies: true,
      },
      orderBy: {
        category: 'asc',
      },
    })
    
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Skills fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const skill = await prisma.skill.create({
      data: {
        ...data,
      },
    })
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Skill create error:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}

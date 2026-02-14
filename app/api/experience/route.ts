import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        startDate: 'desc',
      },
    })
    
    // Parse highlights from JSON string to array
    const parsedExperiences = experiences.map(exp => ({
      ...exp,
      highlights: exp.highlights ? JSON.parse(exp.highlights) : [],
    }))
    
    return NextResponse.json(parsedExperiences)
  } catch (error) {
    console.error('Experience fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Convert highlights array to JSON string for SQLite
    const experienceData = {
      title: data.title,
      company: data.company,
      location: data.location || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current || false,
      description: data.description,
      highlights: data.highlights ? JSON.stringify(data.highlights) : null,
      sortOrder: data.sortOrder || 0,
    }
    
    const experience = await prisma.experience.create({
      data: experienceData,
    })
    
    // Parse highlights back to array for response
    const response = {
      ...experience,
      highlights: experience.highlights ? JSON.parse(experience.highlights) : [],
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Experience create error:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}

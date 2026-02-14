import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: params.id },
      include: { skills: true },
    })
    
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }
    
    // Parse highlights from JSON string to array
    const response = {
      ...experience,
      highlights: experience.highlights ? JSON.parse(experience.highlights) : [],
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Experience fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: experienceData,
    })
    
    // Revalidate pages that display experience
    revalidatePath('/about')
    revalidatePath('/admin/experience')
    
    // Parse highlights back to array for response
    const response = {
      ...experience,
      highlights: experience.highlights ? JSON.parse(experience.highlights) : [],
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Experience update error:', error)
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.experience.delete({
      where: { id: params.id },
    })
    
    // Revalidate pages that display experience
    revalidatePath('/about')
    revalidatePath('/admin/experience')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Experience delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}

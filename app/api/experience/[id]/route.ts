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
    
    return NextResponse.json(experience)
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
    
    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: {
        ...data,
      },
    })
    
    // Revalidate pages that display experience
    revalidatePath('/about')
    revalidatePath('/admin/experience')
    
    return NextResponse.json(experience)
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

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: params.id },
      include: { technologies: true },
    })
    
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Skill fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
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
    
    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: {
        ...data,
      },
    })
    
    // Revalidate pages that display skills
    revalidatePath('/about')
    revalidatePath('/admin/skills')
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Skill update error:', error)
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.skill.delete({
      where: { id: params.id },
    })
    
    // Revalidate pages that display skills
    revalidatePath('/about')
    revalidatePath('/admin/skills')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Skill delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}

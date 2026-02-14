import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET single project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        technologies: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Fetch project error:', error)
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
}

// PUT update project
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail,
        heroImage: data.heroImage,
        featured: data.featured,
        published: data.published,
        year: data.year,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        keyFeatures: data.keyFeatures,
        sortOrder: data.sortOrder,
      },
    })
    
    // Revalidate projects pages
    revalidatePath('/projects')
    revalidatePath(`/projects/${project.slug}`)
    revalidatePath('/admin/projects')
    revalidatePath('/', 'layout')
    
    return NextResponse.json({ success: true, message: 'Project updated', data: project })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.project.delete({
      where: { id: params.id },
    })
    
    // Revalidate projects pages
    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    revalidatePath('/', 'layout')
    
    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

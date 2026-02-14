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

    // Parse keyFeatures from JSON string to array
    const projectData = {
      ...project,
      keyFeatures: project.keyFeatures ? JSON.parse(project.keyFeatures as string) : [],
    }

    return NextResponse.json(projectData)
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
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail || null,
        heroImage: data.heroImage || null,
        featured: data.featured || false,
        published: data.published || false,
        year: data.year || new Date().getFullYear(),
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        keyFeatures: data.keyFeatures ? JSON.stringify(data.keyFeatures.filter((f: string) => f.trim() !== '')) : null,
        sortOrder: data.sortOrder || 0,
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

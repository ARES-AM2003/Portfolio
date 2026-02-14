import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        technologies: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Fetch projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST create new project
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail,
        heroImage: data.heroImage,
        featured: data.featured || false,
        published: data.published || false,
        year: data.year || new Date().getFullYear(),
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        keyFeatures: data.keyFeatures || [],
        sortOrder: data.sortOrder || 0,
      }
    })

    // Revalidate projects pages
    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true, message: 'Project created', data: project })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

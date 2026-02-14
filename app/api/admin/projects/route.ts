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

    // Parse keyFeatures from JSON string to array for each project
    const parsedProjects = projects.map(project => ({
      ...project,
      keyFeatures: project.keyFeatures ? JSON.parse(project.keyFeatures as string) : [],
    }))

    return NextResponse.json(parsedProjects)
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
    
    // Generate slug from title
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: slug,
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

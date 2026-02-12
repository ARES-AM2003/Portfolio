import Sidebar from '@/components/Sidebar'
import ProjectCard from '@/components/ProjectCard'
import { prisma } from '@/lib/prisma'

export const revalidate = 60 // Revalidate every 60 seconds

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
      },
      include: {
        technologies: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })
    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        <section className="relative z-10 min-h-screen p-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">My Projects</h1>
              <p className="text-xl text-gray-400">
                {projects.length > 0 ? `${projects.length} backend development projects` : 'Loading projects...'}
              </p>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={{
                    id: project.id,
                    title: project.title,
                    slug: project.slug,
                    thumbnail: project.thumbnail || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
                    shortDescription: project.shortDescription,
                    technologies: project.technologies.map(t => t.name),
                    featured: project.featured,
                  }} />
                ))}
              </div>
            ) : (
              <div className="glass-effect rounded-2xl p-12 text-center">
                <p className="text-xl text-gray-400 mb-4">No projects yet</p>
                <p className="text-gray-500">Add your first project from the admin panel</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

import Sidebar from '@/components/Sidebar'
import Image from 'next/image'
import { ExternalLink, Github, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

async function getProject(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug, published: true },
      include: {
        technologies: true,
      },
    })
    return project
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>

          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">{project.title}</h1>
            <p className="text-xl text-gray-400">{project.shortDescription}</p>
          </div>

          {project.heroImage && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="glass-effect rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="glass-effect rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
                  <ul className="space-y-4">
                    {(project.keyFeatures as string[]).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Year:</span>
                    <span className="text-white ml-2">{project.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 px-2 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {project.technologies && project.technologies.length > 0 && (
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: any) => (
                      <span
                        key={tech.id}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Links</h3>
                <div className="space-y-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                    >
                      <Github className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                      <span className="text-white">View Source Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                    >
                      <ExternalLink className="text-primary" size={20} />
                      <span className="text-primary">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              Interested in Similar Projects?
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

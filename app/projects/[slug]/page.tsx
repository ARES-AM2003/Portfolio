import Sidebar from '@/components/Sidebar'
import Image from 'next/image'
import { ExternalLink, Github, ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react'
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
      
      <main className="flex-1 bg-background-dark lg:pl-[355px]">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
            <h1 className="text-5xl font-bold text-white mb-4 glow-text" style={{
              textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
            }}>
              {project.title}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">{project.shortDescription}</p>
          </div>

          {/* Hero Image */}
          {project.heroImage && (
            <div
              className="relative h-96 rounded-2xl overflow-hidden mb-8 group"
              style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
            >
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent" />
              {/* Animated border */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl group-hover:border-primary/50 transition-colors duration-300" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div
                className="glass-effect rounded-xl p-8 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Overview</h2>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div
                  className="glass-effect rounded-xl p-8 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                  style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold text-white">Key Features</h2>
                  </div>
                  <ul className="space-y-4">
                    {(project.keyFeatures as string[]).map((feature: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 group"
                        style={{
                          animation: `fadeInLeft 0.4s ease-out ${0.5 + (index * 0.1)}s both`
                        }}
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                          <CheckCircle2 size={14} className="text-primary" />
                        </div>
                        <span className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div
                className="glass-effect rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                style={{ animation: 'fadeInUp 0.5s ease-out 0.35s both' }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  Project Info
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-gray-400">Year</span>
                    <span className="text-white font-semibold">{project.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div
                  className="glass-effect rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                  style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
                >
                  <h3 className="text-lg font-bold text-white mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: any, index: number) => (
                      <span
                        key={tech.id}
                        className="px-3 py-2 bg-primary/10 border border-primary/30 text-primary text-sm rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-200 cursor-default"
                        style={{
                          animation: `scaleIn 0.3s ease-out ${0.45 + (index * 0.05)}s both`
                        }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div
                className="glass-effect rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                style={{ animation: 'fadeInUp 0.5s ease-out 0.45s both' }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Links</h3>
                <div className="space-y-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 group border border-white/10 hover:border-white/20"
                    >
                      <Github className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                      <span className="text-white font-medium">View Source Code</span>
                      <ExternalLink className="ml-auto text-gray-400 group-hover:text-white transition-colors" size={16} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-all duration-300 group border border-primary/30 hover:border-primary/50 hover:scale-105"
                    >
                      <ExternalLink className="text-primary" size={20} />
                      <span className="text-primary font-semibold">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div
            className="glass-effect rounded-2xl p-8 text-center"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.5s both' }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Interested in Similar Projects?</h2>
            <p className="text-gray-400 mb-6">Let's discuss how I can help with your backend needs</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-primary/30"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

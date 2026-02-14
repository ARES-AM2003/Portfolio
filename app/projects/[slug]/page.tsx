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

async function getUserProfile() {
  try {
    const user = await prisma.user.findFirst()
    return user
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  const userProfile = await getUserProfile()

  if (!project) {
    notFound()
  }

  // Parse keyFeatures from JSON string to array
  const keyFeatures = project.keyFeatures 
    ? (typeof project.keyFeatures === 'string' 
        ? JSON.parse(project.keyFeatures) 
        : project.keyFeatures)
    : []

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 relative overflow-x-hidden lg:pl-[355px]">
        {/* Background with Hero Image - Same as About/Projects pages */}
        <div className="fixed inset-0 z-0">
          {userProfile?.heroImage && (
            <Image
              src={userProfile.heroImage}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>

        {/* Cyber Grid Overlay */}
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-primary hover:border-primary/50 hover:bg-white/10 transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>
          </div>

          {/* Header with Featured Badge */}
          <div className="mb-12" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-6xl font-black text-white mb-4 leading-tight" style={{
                  textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                  background: 'linear-gradient(135deg, #fff 0%, rgba(0, 255, 136, 0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {project.title}
                </h1>
                <p className="text-2xl text-gray-300 leading-relaxed max-w-3xl">{project.shortDescription}</p>
              </div>
              {project.featured && (
                <div className="px-6 py-3 bg-primary text-background-dark font-bold rounded-full shadow-lg shadow-primary/50 flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span>FEATURED</span>
                </div>
              )}
            </div>

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                <Calendar size={16} className="text-primary" />
                <span className="text-gray-400">Year:</span>
                <span className="text-white font-semibold">{project.year}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-semibold">Completed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-gray-400">{project.technologies?.length || 0} Technologies</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          {project.heroImage && (
            <div
              className="relative h-[500px] rounded-2xl overflow-hidden mb-12 group"
              style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
            >
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-xl" />
              {/* Glowing Border */}
              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-all duration-500" />
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div
                className="relative"
                style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
                  <h2 className="text-3xl font-bold text-white">Project Overview</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div
                  className="relative"
                  style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
                    <h2 className="text-3xl font-bold text-white">Key Features</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyFeatures.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 group"
                        style={{
                          animation: `fadeInUp 0.4s ease-out ${0.5 + (index * 0.05)}s both`
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle2 size={18} className="text-primary" />
                        </div>
                        <span className="text-gray-300 leading-relaxed group-hover:text-white transition-colors flex-1">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div
                  className="relative"
                  style={{ animation: 'fadeInUp 0.5s ease-out 0.35s both' }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Tech Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: any, index: number) => (
                      <span
                        key={tech.id}
                        className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 hover:scale-105 hover:border-primary/50 transition-all duration-300 cursor-default"
                        style={{
                          animation: `scaleIn 0.3s ease-out ${0.4 + (index * 0.05)}s both`
                        }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div
                className="relative"
                style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Quick Links</h3>
                </div>
                <div className="space-y-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 transition-all duration-300 group hover:translate-x-2"
                    >
                      <Github className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0" size={22} />
                      <div className="flex-1">
                        <div className="text-white font-semibold">Source Code</div>
                        <div className="text-xs text-gray-500">View on GitHub</div>
                      </div>
                      <ExternalLink className="text-gray-400 group-hover:text-primary transition-colors" size={18} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 transition-all duration-300 group hover:translate-x-2"
                    >
                      <ExternalLink className="text-primary flex-shrink-0" size={22} />
                      <div className="flex-1">
                        <div className="text-primary font-bold">Live Demo</div>
                        <div className="text-xs text-primary/70">Visit website</div>
                      </div>
                      <svg className="w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div
            className="relative p-12 text-center overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.5s both' }}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">Interested in Similar Work?</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                I specialize in building robust backend systems and scalable architectures. Let&apos;s discuss your project.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-primary/40"
                >
                  Start a Conversation
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  View More Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

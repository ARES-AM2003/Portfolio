'use client'

import Sidebar from '@/components/Sidebar'
import ProjectCard from '@/components/ProjectCard'
import { ProjectCardSkeleton } from '@/components/LoadingSkeleton'
import { useEffect, useState } from 'react'
import Image from 'next/image'

// Simple cache
let projectsCache: { data: any[], heroImage: string, timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [heroImage, setHeroImage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const now = Date.now()
    
    if (projectsCache && (now - projectsCache.timestamp) < CACHE_DURATION) {
      setProjects(projectsCache.data)
      setHeroImage(projectsCache.heroImage)
      setLoading(false)
      return
    }

    Promise.all([
      fetch('/api/admin/projects').then(res => res.json()),
      fetch('/api/user/profile').then(res => res.json())
    ]).then(([projectsData, profileData]) => {
      if (!isMounted) return
      
      const publishedProjects = projectsData.filter((p: any) => p.published)
      setProjects(publishedProjects)
      if (profileData?.heroImage) {
        setHeroImage(profileData.heroImage)
      }
      projectsCache = { data: publishedProjects, heroImage: profileData?.heroImage || '', timestamp: now }
      setLoading(false)
    }).catch(err => {
      if (!isMounted) return
      console.error('Failed to load:', err)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  function ProjectsGrid({ projects }: { projects: any[] }) {
    if (projects.length === 0) {
      return (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <p className="text-xl text-gray-400 mb-4">No projects yet</p>
          <p className="text-gray-500">Add your first project from the admin panel</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="book-flip-container"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Book Container with 3D Flip */}
            <a 
              href={`/projects/${project.slug}`}
              className="book-flip-inner block"
            >
              {/* Front Cover - Image & Title */}
              <div 
                className="book-flip-front"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* Book Cover Image */}
                <div className="absolute inset-0">
                  <Image
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop'}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority={index < 4}
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
                </div>

                {/* Book Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/60 to-transparent" />
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 text-white text-xs font-bold rounded backdrop-blur-sm">
                    FEATURED
                  </div>
                )}

                {/* Title at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2" style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                  }}>
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary/80 text-sm">
                    <span>Tap to open</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Page Edge Effect */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-white/20 to-transparent" />
              </div>

              {/* Back Cover - Description & Details */}
              <div 
                className="book-flip-back"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* Decorative Corner Accent */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />
                
                {/* Book Spine on Opposite Side */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-primary/20 to-transparent" />
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-background-dark text-xs font-bold rounded-full shadow-lg">
                    ⭐ FEATURED
                  </div>
                )}
                
                {/* Content */}
                <div className="p-8 h-full flex flex-col relative">
                  {/* Title with underline */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
                  </div>

                  {/* Description with better spacing */}
                  <div className="flex-grow mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-5">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Technologies with better layout */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <span className="text-xs text-primary font-semibold uppercase tracking-wider">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 6).map((tech: any) => (
                        <span
                          key={tech.name}
                          className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs rounded-lg font-medium hover:bg-primary/20 hover:border-primary/50 transition-colors"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies?.length > 6 && (
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-lg">
                          +{project.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Project Button - More prominent */}
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between group/btn hover:gap-3 transition-all cursor-pointer">
                      <span className="text-primary font-bold text-sm uppercase tracking-wide">View Full Details</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <svg className="w-4 h-4 text-primary transform translate-x-0 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                  backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              </div>
            </a>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative overflow-x-hidden lg:pl-[355px]">
        {/* Background Image with Glassmorphism */}
        <div className="fixed inset-0 z-0">
          {heroImage && (
            <Image
              src={heroImage}
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
        
        <section className="relative z-10 min-h-screen p-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-white mb-4 glow-text" style={{
                textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
              }}>
                My Projects
              </h1>
              <p className="text-xl text-gray-400">
                {projects.length > 0 ? `${projects.length} backend development projects` : 'Loading projects...'}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ProjectsGrid projects={projects} />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

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
      const publishedProjects = projectsData.filter((p: any) => p.published)
      setProjects(publishedProjects)
      if (profileData?.heroImage) {
        setHeroImage(profileData.heroImage)
      }
      projectsCache = { data: publishedProjects, heroImage: profileData?.heroImage || '', timestamp: now }
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load:', err)
      setLoading(false)
    })
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <ProjectCard project={{
              id: project.id,
              title: project.title,
              slug: project.slug,
              thumbnail: project.thumbnail || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
              shortDescription: project.shortDescription,
              technologies: project.technologies?.map((t: any) => t.name) || [],
              featured: project.featured,
            }} />
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
          <Image
            src={heroImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
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

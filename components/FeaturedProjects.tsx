'use client'

import ProjectCard from './ProjectCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FeaturedProjects() {
  const projects = [
    {
      id: '1',
      title: 'E-Commerce API',
      slug: 'ecommerce-api',
      thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      shortDescription: 'Scalable REST API for e-commerce platform with microservices architecture',
      technologies: ['Node.js', 'MongoDB', 'Redis', 'Docker'],
      featured: true,
    },
    {
      id: '2',
      title: 'Auth Microservice',
      slug: 'auth-microservice',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      shortDescription: 'JWT-based authentication service with OAuth2 integration',
      technologies: ['Python', 'FastAPI', 'PostgreSQL'],
      featured: true,
    },
    {
      id: '3',
      title: 'Real-time Chat API',
      slug: 'realtime-chat',
      thumbnail: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop',
      shortDescription: 'WebSocket-based real-time messaging system',
      technologies: ['Node.js', 'Socket.io', 'MongoDB'],
      featured: true,
    },
  ]

  return (
    <section id="projects" className="min-h-screen bg-background-dark py-20 px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-400">Some of my recent backend work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary/10 hover:bg-primary/20 border-2 border-primary text-primary font-semibold rounded-lg transition-all duration-300 hover:scale-105"
          >
            View All Projects
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}

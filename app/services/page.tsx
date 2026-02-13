'use client'

import Sidebar from '@/components/Sidebar'
import { Download, Code, Server, Database, Settings, Zap, LineChart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'

// Simple cache
let servicesCache: { heroImage: string, timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function ServicesPage() {
  const [heroImage, setHeroImage] = useState('')

  useEffect(() => {
    const now = Date.now()
    if (servicesCache && (now - servicesCache.timestamp) < CACHE_DURATION) {
      setHeroImage(servicesCache.heroImage)
      return
    }

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data?.heroImage) {
          setHeroImage(data.heroImage)
          servicesCache = { heroImage: data.heroImage, timestamp: now }
        }
      })
      .catch(err => console.error('Failed to load profile'))
  }, [])
  const services = [
    {
      icon: Code,
      title: 'API Development',
      description: 'Building scalable RESTful and GraphQL APIs with proper authentication, rate limiting, and documentation.',
      features: ['REST & GraphQL APIs', 'Authentication & Authorization', 'API Documentation', 'Rate Limiting'],
    },
    {
      icon: Server,
      title: 'Microservices Architecture',
      description: 'Designing and implementing microservices-based systems for better scalability and maintainability.',
      features: ['Service Design', 'Inter-service Communication', 'Service Discovery', 'Load Balancing'],
    },
    {
      icon: Database,
      title: 'Database Design',
      description: 'Creating efficient database schemas and optimizing queries for high-performance applications.',
      features: ['Schema Design', 'Query Optimization', 'Migration Strategies', 'Data Modeling'],
    },
    {
      icon: Settings,
      title: 'DevOps & Deployment',
      description: 'Setting up CI/CD pipelines and containerized deployments for automated and reliable releases.',
      features: ['CI/CD Pipelines', 'Docker & Kubernetes', 'Cloud Deployment', 'Monitoring'],
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Analyzing and optimizing backend systems for improved speed, efficiency, and scalability.',
      features: ['Code Profiling', 'Caching Strategies', 'Load Testing', 'System Optimization'],
    },
    {
      icon: LineChart,
      title: 'Technical Consulting',
      description: 'Providing expert advice on technology stack selection, architecture decisions, and best practices.',
      features: ['Architecture Review', 'Tech Stack Selection', 'Code Review', 'Best Practices'],
    },
  ]

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
        
        <section className="relative z-10 min-h-screen p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <div
              className="mb-16"
              style={{ animation: 'fadeInUp 0.6s ease-out' }}
            >
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight" style={{
                textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                background: 'linear-gradient(135deg, #fff 0%, rgba(0, 255, 136, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                What I Offer
              </h1>
              <p className="text-2xl text-gray-300 max-w-3xl">
                Specialized backend development services to power your applications and scale your business
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 mb-16">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="group relative"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Icon with gradient background */}
                    <div className="mb-8">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Icon className="text-primary" size={40} />
                        </div>
                        {/* Animated ring */}
                        <div className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 group-hover:scale-125 transition-all duration-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-4">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300"
                        >
                          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-sm font-bold">✓</span>
                          </div>
                          <span className="text-gray-300 group-hover/item:text-white transition-colors">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Gradient line at bottom */}
                    <div className="mt-6 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )
              })}
            </div>

            {/* CTA Section */}
            <div
              className="relative p-16 text-center overflow-hidden"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}
            >
              {/* Decorative blur elements */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="text-5xl font-bold text-white mb-6">Let's Build Something Great</h2>
                <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Ready to transform your ideas into powerful, scalable backend solutions? Let's discuss your project.
                </p>
                <div className="flex gap-6 justify-center flex-wrap">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-primary hover:bg-primary-dark text-background-dark font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-primary/40"
                  >
                    Start a Conversation
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
                  >
                    View My Work
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

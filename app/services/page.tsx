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
            <div
              className="text-center mb-12"
              style={{ animation: 'fadeInUp 0.6s ease-out' }}
            >
              <h1 className="text-5xl font-bold text-white mb-4 glow-text" style={{
                textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
              }}>
                Services
              </h1>
              <p className="text-xl text-gray-400">What I can do for you</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="glass-effect rounded-2xl p-8 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Icon className="text-primary" size={32} />
                      </div>
                      {/* Animated ring */}
                      <div className="absolute inset-0 w-16 h-16 rounded-xl border-2 border-primary/30 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                    </div>
                    
                    <h3 className="relative text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="relative text-gray-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="relative space-y-2">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2"
                          style={{
                            animation: `fadeInLeft 0.4s ease-out ${(index * 0.1) + 0.3 + (i * 0.05)}s both`
                          }}
                        >
                          <span className="text-primary mt-1 font-bold">✓</span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Hover border effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/30 transition-colors duration-300" />
                  </div>
                )
              })}
            </div>

            {/* CTA Section */}
            <div
              className="glass-effect rounded-2xl p-12 text-center relative overflow-hidden"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />
              
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Start a Project?</h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Let's discuss how I can help bring your backend vision to life
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link
                    href="/contact"
                    className="group relative px-8 py-4 bg-primary text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10">Get in Touch</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-primary/50" />
                  </Link>
                  <Link
                    href="/projects"
                    className="group relative px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Download size={20} />
                      View Projects
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

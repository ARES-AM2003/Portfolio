'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import TypewriterEffect from './TypewriterEffect'

// Simple cache
let heroCache: { data: any, timestamp: number, imageLoaded: boolean } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function HeroSection() {
  const [userData, setUserData] = useState({
    name: '',
    title: '',
    heroImage: '',
    bio: '',
  })
  const [imageLoaded, setImageLoaded] = useState(false)

  // Fetch user data from API with caching
  useEffect(() => {
    const now = Date.now()
    if (heroCache && (now - heroCache.timestamp) < CACHE_DURATION) {
      setUserData(heroCache.data)
      setImageLoaded(heroCache.imageLoaded)
      return
    }
    
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setUserData(data)
          // Preload image
          if (data.heroImage) {
            const img = new Image()
            img.src = data.heroImage
            img.onload = () => {
              setImageLoaded(true)
              heroCache = { data, timestamp: now, imageLoaded: true }
            }
          } else {
            setImageLoaded(true)
          }
        }
      })
      .catch(err => console.error('Failed to load profile'))
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden bg-background-dark">
      {/* Background Image - Dynamic from DB */}
      {userData.heroImage && imageLoaded && (
        <div className="absolute inset-0">
          <Image
            src={userData.heroImage}
            alt="Hero background"
            fill
            className="object-cover opacity-100"
            priority
            quality={100}
            unoptimized
          />
          {/* Glassmorphism overlay on top of image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      )}
      
      {/* Cyber Grid */}
      <div className="absolute inset-0 z-10 opacity-15 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />
      </div>
      
      {/* Scan Lines Effect */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 136, 0.3) 2px, rgba(0, 255, 136, 0.3) 4px)',
          animation: 'scan 8s linear infinite'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-30 h-full flex items-center px-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-7xl font-bold text-white mb-6 glow-text" style={{
              textShadow: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)'
            }}>
              {userData.name}
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <TypewriterEffect 
              texts={[
                'Backend Developer',
                'API Architect',
                'System Designer',
                'Database Expert',
                'Cloud Solutions Engineer',
                'Microservices Specialist'
              ]}
              typingSpeed={80}
              deletingSpeed={50}
              delayBetweenTexts={2000}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl"
          >
            {userData.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex gap-4"
          >
            <Link
              href="/contact"
              className="group relative px-8 py-4 bg-primary text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Get in Touch</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-primary/50" />
            </Link>
            <Link
              href="/projects"
              className="group relative px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">View Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Navigate to Projects */}
      <Link
        href="/projects"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer hover:scale-110 transition-transform"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-gray-400">View Projects</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </Link>
    </section>
  )
}

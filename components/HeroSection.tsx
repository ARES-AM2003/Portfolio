'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [userData, setUserData] = useState({
    name: 'Alex Smith',
    title: 'Freelancer',
    heroImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1920&h=1080&fit=crop', // Will be dynamic from DB
    bio: 'Building scalable backend systems and APIs',
  })

  // Fetch user data from API
  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setUserData(data)
        }
      })
      .catch(err => console.error('Failed to load profile'))
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Scan Lines Effect */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 136, 0.3) 2px, rgba(0, 255, 136, 0.3) 4px)',
          animation: 'scan 8s linear infinite'
        }} />
      </div>
      
      {/* Cyber Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />
      </div>
      
      {/* Background Image - Dynamic from DB */}
      <div className="absolute inset-0 z-0">
        <Image
          src={userData.heroImage || '/placeholder-hero.jpg'}
          alt="Hero background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-16">
        <div className="max-w-3xl">
          <h1 className="text-7xl font-bold text-white mb-6 glow-text" style={{
            textShadow: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)'
          }}>
            {userData.name}
          </h1>
          
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl text-gray-300">{'>'}</span>
            <span className="text-2xl font-semibold text-primary animate-pulse">
              {userData.title}
            </span>
            <span className="text-2xl text-primary animate-pulse">_</span>
          </div>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            {userData.bio}
          </p>

          <div className="flex gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
            >
              Get in Touch
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 border-2 border-white/20 hover:border-primary text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              View Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Navigate to Portfolio */}
      <Link
        href="/portfolio"
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

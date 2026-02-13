'use client'

import Sidebar from '@/components/Sidebar'
import HeroSection from '@/components/HeroSection'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [heroImage, setHeroImage] = useState('')

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data?.heroImage) {
          setHeroImage(data.heroImage)
        }
      })
      .catch(err => console.error('Failed to load profile'))
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden lg:pl-[355px]">
        {/* Background Image with Glassmorphism */}
        <div className="fixed inset-0 z-0">
          {heroImage && (
            <Image
              src={heroImage}
              alt="Background"
              fill
              className="object-cover"
              priority
              quality={100}
              unoptimized
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

        <HeroSection />
      </main>
    </div>
  )
}

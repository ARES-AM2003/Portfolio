'use client'

import Sidebar from '@/components/Sidebar'
import { SkillCardSkeleton, ExperienceCardSkeleton } from '@/components/LoadingSkeleton'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

// Simple cache to store API responses
const cache: { [key: string]: { data: any, timestamp: number } } = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache(url: string) {
  const now = Date.now()
  if (cache[url] && (now - cache[url].timestamp) < CACHE_DURATION) {
    return cache[url].data
  }
  
  const response = await fetch(url)
  const data = await response.json()
  cache[url] = { data, timestamp: now }
  return data
}

export default function AboutPage() {
  const [heroImage, setHeroImage] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [skills, setSkills] = useState<Record<string, any[]>>({})
  const [experience, setExperience] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchWithCache('/api/user/profile'),
      fetchWithCache('/api/skills'),
      fetchWithCache('/api/experience')
    ]).then(([profileData, skillsData, experienceData]) => {
      if (profileData) {
        setProfile(profileData)
        if (profileData.heroImage) {
          setHeroImage(profileData.heroImage)
        }
      }
      
      // Group skills by category
      if (Array.isArray(skillsData)) {
        const grouped: Record<string, any[]> = {}
        skillsData.forEach((skill: any) => {
          if (!grouped[skill.category]) {
            grouped[skill.category] = []
          }
          grouped[skill.category].push({
            name: skill.name,
            proficiency: skill.proficiency,
            yearsOfExperience: skill.yearsOfExperience,
          })
        })
        setSkills(grouped)
      }
      
      if (Array.isArray(experienceData)) {
        setExperience(experienceData)
      }
      
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load data:', err)
      setLoading(false)
    })
  }, [])

function SkillsSection({ skills }: { skills: Record<string, any[]> }) {
  if (Object.keys(skills).length === 0) {
    return <p className="text-gray-400">No skills added yet. Add skills from the admin panel.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(skills).map(([category, skillList], categoryIndex) => (
        <div
          key={category}
          style={{
            animation: `fadeInUp 0.6s ease-out ${categoryIndex * 0.1}s both`
          }}
        >
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {category}
          </h3>
          <div className="space-y-3">
            {(skillList as any[]).map((skill, index) => (
              <div
                key={skill.name}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${(categoryIndex * 0.1) + (index * 0.05)}s both`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium group-hover:text-primary transition-colors">
                    {skill.name}
                  </span>
                  {skill.yearsOfExperience && (
                    <span className="text-xs text-primary font-semibold bg-primary/10 border border-primary/30 px-3 py-1 rounded-full">
                      {skill.yearsOfExperience}+ {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Proficiency</span>
                    <span className="text-primary font-semibold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${skill.proficiency}%`,
                        animation: `expandWidth 1s ease-out ${(categoryIndex * 0.1) + (index * 0.05) + 0.3}s both`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExperienceTimeline({ experience }: { experience: any[] }) {
  if (experience.length === 0) {
    return <p className="text-gray-400">No experience added yet. Add your work history from the admin panel.</p>
  }

  return (
    <div className="space-y-8">
      {experience.map((exp: any, index: number) => {
        const startYear = new Date(exp.startDate).getFullYear()
        const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'
        
        return (
          <div
            key={exp.id || index}
            className="flex gap-6 group"
            style={{
              animation: `fadeInLeft 0.6s ease-out ${index * 0.15}s both`
            }}
          >
            <div className="flex-shrink-0 w-32 text-primary font-semibold relative">
              <div className="sticky top-8">
                {startYear} - {endYear}
              </div>
            </div>
            <div className="flex-1 pb-8 border-l-2 border-white/[0.03] pl-6 relative group-hover:border-primary/20 transition-colors duration-300">
              {/* Timeline dot */}
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background-dark group-hover:scale-125 transition-transform duration-300" />
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {exp.title}
                </h3>
                <p className="text-gray-400 mb-3 font-medium">{exp.company}</p>
                <p className="text-gray-300 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative overflow-x-hidden lg:pl-[355px]">
        {/* Background Image with Glassmorphism - Same as Home */}
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
            <h1
              className="text-5xl font-bold text-white mb-12 glow-text"
              style={{
                textShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                animation: 'fadeInUp 0.6s ease-out'
              }}
            >
              About Me
            </h1>
            
            {/* Grid Layout: 2 columns - Left (Story + Experience), Right (Skills) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
              {/* Left Column: Story + Experience */}
              <div className="space-y-12">
                {/* My Story */}
                <div
                  style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-primary">{'<'}</span>
                    My Story
                    <span className="text-primary">{'/>'}</span>
                  </h2>
                  <div className="space-y-6">
                    {profile?.bio && (
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div
                  className="mt-8"
                  style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}
                >
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="text-primary">{'<'}</span>
                    Experience
                    <span className="text-primary">{'/>'}</span>
                  </h2>
                  
                  {loading ? (
                    <div className="space-y-8">
                      {[...Array(3)].map((_, i) => (
                        <ExperienceCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <ExperienceTimeline experience={experience} />
                  )}
                </div>
              </div>

              {/* Right Column: Skills */}
              <div
                className="lg:sticky lg:top-8"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
              >
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-primary">{'<'}</span>
                  Technical Skills
                  <span className="text-primary">{'/>'}</span>
                </h2>
                
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                      <div key={i}>
                        <div className="h-6 bg-white/10 rounded w-32 mb-4 animate-pulse" />
                        <div className="space-y-3">
                          {[...Array(2)].map((_, j) => (
                            <SkillCardSkeleton key={j} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(skills).length === 0 ? (
                      <p className="text-gray-400">No skills added yet. Add skills from the admin panel.</p>
                    ) : (
                      Object.entries(skills).map(([category, skillList], categoryIndex) => (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {category}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {(skillList as any[]).map((skill, index) => {
                              // Convert proficiency to stars (0-5)
                              const stars = Math.round((skill.proficiency / 100) * 5)
                              
                              return (
                                <div
                                  key={skill.name}
                                  className="p-3"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white text-sm font-medium">
                                      {skill.name}
                                    </span>
                                    {skill.yearsOfExperience && (
                                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                                        {skill.yearsOfExperience}y
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={16}
                                        className={i < stars ? 'fill-primary text-primary' : 'text-gray-600'}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

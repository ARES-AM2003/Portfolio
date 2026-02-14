'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import TypewriterEffect from './TypewriterEffect'

const quotes = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Code never lies, comments sometimes do.", author: "Ron Jeffries" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "It's not a bug – it's an undocumented feature.", author: "Anonymous" },
  { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { text: "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.", author: "Antoine de Saint-Exupéry" },
  { text: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
  { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" },
  { text: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.", author: "Dan Salomon" },
  { text: "Testing leads to failure, and failure leads to understanding.", author: "Burt Rutan" },
  { text: "If debugging is the process of removing bugs, then programming must be the process of putting them in.", author: "Edsger Dijkstra" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" }
]

export default function HeroSection() {
  const [userData, setUserData] = useState({
    name: '',
    title: '',
    bio: '',
  })

  // Fetch user data from API - no caching to ensure fresh data
  useEffect(() => {
    const now = Date.now()
    
    fetch('/api/user/profile?t=' + now, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
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

      {/* Content */}
      <div className="relative z-30 h-full flex items-center justify-between px-16 pl-32 pr-20 gap-12">
        <div className="flex-1 max-w-[850px]">
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
            className="text-xl text-gray-300 mb-8"
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

        {/* Right Side - Quotes */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden xl:block flex-shrink-0"
        >
          {/* Quote Section */}
          <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-[450px] h-[200px] shadow-2xl flex items-center">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/40 rounded-br-2xl"></div>
            
            {/* Quote content */}
            <div className="relative w-full">
              <TypewriterEffect 
                texts={quotes.map(q => `${q.text} — ${q.author}`)}
                typingSpeed={40}
                deletingSpeed={20}
                delayBetweenTexts={3000}
              />
            </div>
          </div>
        </motion.div>
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

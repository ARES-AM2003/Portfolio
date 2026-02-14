'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, User, FileText, Briefcase, Wrench, ChevronDown, Mail, Github, Linkedin, Twitter, Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    avatar: '',
    title: '',
    github: '',
    linkedin: '',
    twitter: '',
  })

  const lastScrollTime = useRef(0)
  const isNavigating = useRef(false)
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load profile')
        setLoading(false)
      })
  }, [])

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/about', icon: User, label: 'About' },
    { href: '/projects', icon: Briefcase, label: 'Projects' },
    { href: '/services', icon: Wrench, label: 'Services' },
    { href: '/contact', icon: Mail, label: 'Contact' },
  ]

  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Scroll navigation effect - COMMENTED OUT
  // useEffect(() => {
  //   const handleWheel = (e: WheelEvent) => {
  //     if (pathname.startsWith('/admin')) return

  //     const now = Date.now()
  //     const timeSinceLastScroll = now - lastScrollTime.current

  //     if (timeSinceLastScroll < 4000 || isNavigating.current) return

  //     const atTop = window.scrollY === 0
  //     const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

  //     const currentIndex = navItems.findIndex(item => item.href === pathname)
  //     if (currentIndex === -1) return

  //     if (e.deltaY > 0 && atBottom && currentIndex < navItems.length - 1) {
  //       e.preventDefault()
  //       isNavigating.current = true
  //       lastScrollTime.current = now
        
  //       setTimeout(() => {
  //         router.push(navItems[currentIndex + 1].href)
  //         setTimeout(() => {
  //           isNavigating.current = false
  //         }, 3500)
  //       }, 100)
  //     } else if (e.deltaY < 0 && atTop && currentIndex > 0) {
  //       e.preventDefault()
  //       isNavigating.current = true
  //       lastScrollTime.current = now
        
  //       setTimeout(() => {
  //         router.push(navItems[currentIndex - 1].href)
  //         setTimeout(() => {
  //           isNavigating.current = false
  //         }, 3500)
  //       }, 100)
  //     }
  //   }

  //   window.addEventListener('wheel', handleWheel, { passive: false })
  //   return () => window.removeEventListener('wheel', handleWheel)
  // }, [pathname, router, navItems])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 rounded-lg bg-background-surface border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-8 h-screen z-40
        w-[340px] flex flex-col p-4
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Glassmorphism Container with gaps */}
        <div className="flex-1 flex flex-col gap-4 py-4">
          {/* Decorative top pattern */}
          <div className="hidden lg:block h-16 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent backdrop-blur-2xl border border-white/20" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 255, 136, 0.15) 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Main sidebar content with glassmorphism */}
          <div className="flex-1 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-background-surface/70 via-background-surface/50 to-background-surface/70 border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                animation: 'backgroundScroll 20s linear infinite'
              }} />
            </div>

            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-3xl rounded-full" />
            
            <div className="relative flex flex-col h-full">
              {/* Profile Section */}
              <div className="p-8 border-b border-white/10">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4 group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-xl group-hover:blur-2xl transition-all duration-500" />
                    {loading ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-primary/30 bg-white/10 animate-pulse" />
                    ) : userData.avatar ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300">
                        <Image
                          src={userData.avatar}
                          alt={userData.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          priority
                        />
                      </div>
                    ) : null}
                    {/* Status indicator */}
                    <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-background-surface shadow-lg">
                      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                    </div>
                  </div>
                  
                  {loading ? (
                    <>
                      <div className="h-7 w-32 bg-white/10 rounded mb-2 animate-pulse" />
                      <div className="h-4 w-24 bg-white/10 rounded mb-2 animate-pulse" />
                      <div className="h-6 w-28 bg-white/10 rounded-full animate-pulse" />
                    </>
                  ) : (
                    <>
                      {userData.name && <h2 className="text-2xl font-bold text-white mb-1 glow-text">{userData.name}</h2>}
                      {userData.title && <p className="text-gray-400 text-sm mb-2">{userData.title}</p>}
                      {userData.name && (
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                          Available for work
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3 mt-6">
                  {userData.twitter && (
                    <a
                      href={userData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group overflow-hidden border border-white/10 hover:border-primary/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Twitter size={18} className="text-gray-300 group-hover:text-primary relative z-10 transition-colors" />
                    </a>
                  )}
                  {userData.github && (
                    <a
                      href={userData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group overflow-hidden border border-white/10 hover:border-primary/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Github size={18} className="text-gray-300 group-hover:text-primary relative z-10 transition-colors" />
                    </a>
                  )}
                  {userData.linkedin && (
                    <a
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group overflow-hidden border border-white/10 hover:border-primary/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Linkedin size={18} className="text-gray-300 group-hover:text-primary relative z-10 transition-colors" />
                    </a>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6 overflow-y-auto">
                <ul className="space-y-2 w-full">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-lg shadow-primary/20'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {isActive && (
                            <>
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                            </>
                          )}
                          <Icon size={20} className={`relative z-10 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                          <span className="font-medium relative z-10">{item.label}</span>
                          {!isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </div>

          {/* Decorative bottom pattern */}
          <div className="hidden lg:block h-16 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/20 via-primary/5 to-transparent backdrop-blur-2xl border border-white/20" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 255, 136, 0.15) 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-1 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-1 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

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
    name: 'Alex Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', // Will be dynamic from DB
    title: 'Backend Developer',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  })

  const lastScrollTime = useRef(0)
  const isNavigating = useRef(false)

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

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/about', icon: User, label: 'About' },
    { href: '/projects', icon: Briefcase, label: 'Projects' },
    { href: '/services', icon: Wrench, label: 'Services' },
    { href: '/contact', icon: Mail, label: 'Contact' },
  ]

  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Scroll navigation effect
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Skip if user is in admin pages
      if (pathname.startsWith('/admin')) return

      const now = Date.now()
      const timeSinceLastScroll = now - lastScrollTime.current

      // Debounce: only trigger if 1.5 seconds have passed since last navigation
      if (timeSinceLastScroll < 1500 || isNavigating.current) return

      // Check if user is at top or bottom of page
      const atTop = window.scrollY === 0
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

      const currentIndex = navItems.findIndex(item => item.href === pathname)
      if (currentIndex === -1) return

      // Scroll down - go to next page
      if (e.deltaY > 0 && atBottom && currentIndex < navItems.length - 1) {
        e.preventDefault()
        isNavigating.current = true
        lastScrollTime.current = now
        router.push(navItems[currentIndex + 1].href)
        setTimeout(() => {
          isNavigating.current = false
        }, 500)
      }
      // Scroll up - go to previous page
      else if (e.deltaY < 0 && atTop && currentIndex > 0) {
        e.preventDefault()
        isNavigating.current = true
        lastScrollTime.current = now
        router.push(navItems[currentIndex - 1].href)
        setTimeout(() => {
          isNavigating.current = false
        }, 500)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [pathname, router, navItems])

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
        fixed lg:sticky top-0 h-screen z-40
        w-72 bg-background-surface border-r border-white/10 flex flex-col
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Profile Section */}
      <div className="p-8 border-b border-white/10">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden ring-4 ring-primary/30">
            <Image
              src={userData.avatar || '/placeholder-avatar.jpg'}
              alt={userData.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{userData.name}</h2>
          <p className="text-gray-400 text-sm">{userData.title}</p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-6">
          {userData.twitter && (
            <a
              href={userData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Twitter size={18} className="text-gray-300" />
            </a>
          )}
          {userData.github && (
            <a
              href={userData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Github size={18} className="text-gray-300" />
            </a>
          )}
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-300">
              <path d="M8 3C8.55228 3 9 3.44772 9 4V8H15V4C15 3.44772 15.4477 3 16 3C16.5523 3 17 3.44772 17 4V8H20C20.5523 8 21 8.44772 21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9C3 8.44772 3.44772 8 4 8H7V4C7 3.44772 7.44772 3 8 3ZM19 10H5V19H19V10Z" fill="currentColor"/>
            </svg>
          </a>
          {userData.linkedin && (
            <a
              href={userData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={18} className="text-gray-300" />
            </a>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
          
          {/* Dropdown Example */}
          {/* <li>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Wrench size={20} />
                <span className="font-medium">Dropdown</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {dropdownOpen && (
              <ul className="mt-2 ml-8 space-y-1">
                <li>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-primary">
                    Sub Item 1
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-primary">
                    Sub Item 2
                  </Link>
                </li>
              </ul>
            )}
          </li> */}
        </ul>
      </nav>
    </aside>
    </>
  )
}

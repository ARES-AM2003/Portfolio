'use client'

import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'
import { Send, CheckCircle, Mail, MapPin, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Simple cache
let contactCache: { heroImage: string, timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function ContactPage() {
  const [heroImage, setHeroImage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let isMounted = true
    const now = Date.now()
    
    if (contactCache && (now - contactCache.timestamp) < CACHE_DURATION) {
      setHeroImage(contactCache.heroImage)
      return
    }

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return
        if (data?.heroImage) {
          setHeroImage(data.heroImage)
          contactCache = { heroImage: data.heroImage, timestamp: now }
        }
      })
      .catch(err => console.error('Failed to load profile'))
      
    return () => {
      isMounted = false
    }
  }, [])

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : ''
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : ''
      default:
        return ''
    }
  }

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true })
    const error = validateField(name, formData[name as keyof typeof formData])
    setErrors({ ...errors, [name]: error })
  }

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors({ ...errors, [name]: error })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ name: true, email: true, subject: true, message: true })
      return
    }

    setSending(true)
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      setTimeout(() => {
        setSending(false)
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setErrors({})
        setTouched({})
        
        // Reset after 5 seconds
        setTimeout(() => setSubmitted(false), 5000)
      }, 1000)
    } catch (error) {
      setSending(false)
      alert('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative overflow-x-hidden lg:pl-[370px]">
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
        
        <section className="relative z-10 min-h-screen p-8 md:p-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight" style={{
                textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                background: 'linear-gradient(135deg, #fff 0%, rgba(0, 255, 136, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Let&apos;s Connect</h1>
              <p className="text-2xl text-gray-300 max-w-3xl">Have a project in mind? Let&apos;s discuss how we can work together to build something exceptional.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Send Message</h2>
                
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <CheckCircle size={64} className="text-primary mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-400">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                            errors.name && touched.name
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/10 focus:border-primary focus:shadow-lg focus:shadow-primary/20'
                          }`}
                          placeholder="Your name"
                          required
                        />
                        {errors.name && touched.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                            errors.email && touched.email
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/10 focus:border-primary focus:shadow-lg focus:shadow-primary/20'
                          }`}
                          placeholder="your@email.com"
                          required
                        />
                        {errors.email && touched.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                          placeholder="Project inquiry"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          onBlur={() => handleBlur('message')}
                          rows={5}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none ${
                            errors.message && touched.message
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/10 focus:border-primary focus:shadow-lg focus:shadow-primary/20'
                          }`}
                          placeholder="Tell me about your project..."
                          required
                        />
                        <div className="flex justify-between items-center mt-1">
                          {errors.message && touched.message && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-sm"
                            >
                              {errors.message}
                            </motion.p>
                          )}
                          <p className="text-gray-500 text-sm ml-auto">
                            {formData.message.length} characters
                          </p>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-primary/30"
                      >
                        {sending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Send size={20} />
                            </motion.div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Contact Info */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <h2 className="text-3xl font-bold text-white mb-8">Contact Info</h2>
                  
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-5 group"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Mail className="text-primary" size={24} />
                        </div>
                        <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 group-hover:scale-125 transition-all duration-300" />
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</p>
                        <a href="mailto:alex@example.com" className="text-lg text-primary hover:underline font-medium">
                          alex@example.com
                        </a>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-5 group"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <MapPin className="text-primary" size={24} />
                        </div>
                        <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 group-hover:scale-125 transition-all duration-300" />
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Location</p>
                        <p className="text-lg text-white font-medium">San Francisco, CA</p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-5 group"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Phone className="text-primary" size={24} />
                        </div>
                        <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 group-hover:scale-125 transition-all duration-300" />
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Phone</p>
                        <a href="tel:+15551234567" className="text-lg text-primary hover:underline font-medium">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    <span className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Quick Response
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-4">
                    I typically respond within <span className="text-primary font-semibold">24 hours</span> during business days.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400">Currently available</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

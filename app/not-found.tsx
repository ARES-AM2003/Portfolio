'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 border border-primary/10 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0.5, 0.2, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-9xl font-bold mb-4" style={{
            background: 'linear-gradient(to right, #00ff88, #00cc6a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 80px rgba(0, 255, 136, 0.3)'
          }}>
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <Home size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Go Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-primary/50" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="relative z-10">Go Back</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>

        {/* Glitch effect text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8, 1] }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-500 font-mono">
            {'>'} ERROR: PAGE_NOT_FOUND_
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              |
            </motion.span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

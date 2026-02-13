'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  slug: string
  thumbnail: string
  shortDescription: string
  technologies: string[]
  featured: boolean
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-effect rounded-2xl overflow-hidden group relative"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {project.featured && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              className="absolute top-4 right-4 px-4 py-2 bg-primary text-background-dark font-semibold rounded-full text-sm shadow-lg shadow-primary/50"
            >
              ⭐ Featured
            </motion.div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Hover Overlay with View Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-white font-semibold flex items-center gap-2 px-6 py-3 border-2 border-white rounded-lg bg-background-dark/50">
              <ExternalLink size={20} />
              View Details
            </div>
          </motion.div>

          {/* Animated border on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl animate-pulse" />
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-sm rounded-lg hover:bg-primary/20 hover:border-primary/50 transition-all duration-200"
              >
                {tech}
              </motion.span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-lg">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-primary/20" />
      </div>
    </motion.div>
  )
}

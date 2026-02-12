'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300"
    >
      <Link href={`/portfolio/${project.slug}`}>
        <div className="relative h-64">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {project.featured && (
            <div className="absolute top-4 right-4 px-4 py-2 bg-primary text-background-dark font-semibold rounded-full text-sm">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60" />
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2">
            {project.shortDescription}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-sm rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

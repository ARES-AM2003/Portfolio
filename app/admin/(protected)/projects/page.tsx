'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Project deleted successfully')
        fetchProjects()
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
              <p className="text-gray-400">Manage your portfolio projects</p>
            </div>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Plus size={20} />
              New Project
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <p className="text-xl text-gray-400 mb-4">No projects yet</p>
              <p className="text-gray-500 mb-6">Create your first project to showcase your work</p>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300"
              >
                <Plus size={20} />
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="glass-effect rounded-xl overflow-hidden group">
                  <div className="relative h-48">
                    <Image
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {project.featured && (
                        <span className="px-3 py-1 bg-primary text-background-dark text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      )}
                      {project.published && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Published
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.shortDescription}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{project.views || 0} views</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="flex items-center justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

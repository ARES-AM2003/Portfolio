'use client'

import AdminSidebar from '@/components/AdminSidebar'
import React, { useState, useEffect } from 'react'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditProject({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    heroImage: '',
    githubUrl: '',
    liveUrl: '',
    year: new Date().getFullYear(),
    featured: false,
    published: true,
    keyFeatures: [''],
  })

  const fetchProject = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/projects/${params.id}`)
      const data = await response.json()
      
      setFormData({
        title: data.title || '',
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        thumbnail: data.thumbnail || '',
        heroImage: data.heroImage || '',
        githubUrl: data.githubUrl || '',
        liveUrl: data.liveUrl || '',
        year: data.year || new Date().getFullYear(),
        featured: data.featured || false,
        published: data.published || true,
        keyFeatures: data.keyFeatures || [''],
      })
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('Project updated successfully!')
        router.push('/admin/projects')
      } else {
        alert('Failed to update project: ' + result.error)
      }
    } catch (error) {
      alert('Error updating project')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      keyFeatures: [...formData.keyFeatures, ''],
    })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.keyFeatures]
    newFeatures[index] = value
    setFormData({ ...formData, keyFeatures: newFeatures })
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      keyFeatures: formData.keyFeatures.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading project...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/projects"
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-gray-400" size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Edit Project</h1>
              <p className="text-gray-400">Update project details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="E-Commerce API"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Brief one-line description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Detailed project description..."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Images</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({...formData, heroImage: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Links & Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Key Features</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                >
                  + Add Feature
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Feature description"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary focus:ring-primary"
                  />
                  <span className="text-white">Featured Project</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary focus:ring-primary"
                  />
                  <span className="text-white">Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/admin/projects"
                className="px-8 py-3 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

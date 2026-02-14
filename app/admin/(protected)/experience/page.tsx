'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Briefcase } from 'lucide-react'
import { toast } from 'sonner'

interface Experience {
  id: string
  title: string
  company: string
  location?: string
  startDate: Date
  endDate?: Date
  current: boolean
  description: string
  highlights: string[]
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    highlights: [''],
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience')
      const data = await response.json()
      setExperiences(data)
    } catch (error) {
      console.error('Failed to fetch experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.current ? null : formData.endDate ? new Date(formData.endDate) : null,
      highlights: formData.highlights.filter(h => h.trim() !== ''),
    }
    
    try {
      const url = editingId ? `/api/experience/${editingId}` : '/api/experience'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (response.ok) {
        toast.success(editingId ? 'Experience updated successfully!' : 'Experience added successfully!')
        setShowForm(false)
        setEditingId(null)
        resetForm()
        fetchExperiences()
      } else {
        toast.error(editingId ? 'Failed to update experience' : 'Failed to add experience')
      }
    } catch (error) {
      toast.error('Error saving experience')
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    
    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Experience deleted successfully')
        fetchExperiences()
      } else {
        toast.error('Failed to delete experience')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete experience')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [''],
    })
  }

  const startEdit = (exp: Experience) => {
    setEditingId(exp.id)
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      startDate: new Date(exp.startDate).toISOString().split('T')[0],
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      current: exp.current,
      description: exp.description,
      highlights: exp.highlights.length > 0 ? exp.highlights : [''],
    })
    setShowForm(true)
  }

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, ''],
    })
  }

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    setFormData({ ...formData, highlights: newHighlights })
  }

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Experience</h1>
              <p className="text-gray-400">Manage your work history</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Plus size={20} />
              Add Experience
            </button>
          </div>

          {/* Create Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="glass-effect rounded-xl p-8 max-w-2xl w-full my-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit' : 'Add'} Work Experience</h2>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                        placeholder="Senior Backend Developer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                        placeholder="Tech Corp"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        disabled={formData.current}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: ''})}
                      className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary focus:ring-primary"
                    />
                    <span className="text-white">I currently work here</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="Brief description of your role and responsibilities..."
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-300">
                        Key Highlights
                      </label>
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        + Add Highlight
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => updateHighlight(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                            placeholder="Achievement or responsibility"
                          />
                          {formData.highlights.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHighlight(index)}
                              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all"
                    >
                      Add Experience
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading experiences...</p>
            </div>
          ) : experiences.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <Briefcase className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-xl text-gray-400 mb-4">No work experience yet</p>
              <p className="text-gray-500 mb-6">Add your work history to showcase your career</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all"
              >
                <Plus size={20} />
                Add Experience
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp) => {
                const startDate = new Date(exp.startDate)
                const endDate = exp.endDate ? new Date(exp.endDate) : null
                const period = `${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${endDate ? endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}`

                return (
                  <div key={exp.id} className="glass-effect rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{exp.title}</h3>
                        <p className="text-primary font-semibold mb-1">{exp.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{period}</span>
                          {exp.location && <span>• {exp.location}</span>}
                          {exp.current && (
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(exp)}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          title="Edit experience"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                          title="Delete experience"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{exp.description}</p>

                    {exp.highlights && exp.highlights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Highlights:</h4>
                        <ul className="space-y-2">
                          {exp.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

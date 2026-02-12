'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  yearsOfExperience?: number
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Backend',
    proficiency: 50,
    yearsOfExperience: 0,
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        alert('Skill created successfully!')
        setShowCreateForm(false)
        setFormData({ name: '', category: 'Backend', proficiency: 50, yearsOfExperience: 0 })
        fetchSkills()
      } else {
        alert('Failed to create skill')
      }
    } catch (error) {
      alert('Error creating skill')
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        alert('Skill deleted successfully')
        fetchSkills()
      } else {
        alert('Failed to delete skill')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete skill')
    }
  }

  const categories = ['Backend', 'Frontend', 'Database', 'DevOps', 'Tools', 'Other']

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
              <p className="text-gray-400">Manage your technical skills</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Plus size={20} />
              Add Skill
            </button>
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="glass-effect rounded-xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Add New Skill</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="e.g., Node.js"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Proficiency: {formData.proficiency}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.proficiency}
                      onChange={(e) => setFormData({...formData, proficiency: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({...formData, yearsOfExperience: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 px-4 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all"
                    >
                      Create Skill
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading skills...</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <p className="text-xl text-gray-400 mb-4">No skills yet</p>
              <p className="text-gray-500 mb-6">Add your first skill to showcase your expertise</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all"
              >
                <Plus size={20} />
                Add Skill
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = []
                  acc[skill.category].push(skill)
                  return acc
                }, {} as Record<string, Skill[]>)
              ).map(([category, categorySkills]) => (
                <div key={category} className="glass-effect rounded-xl p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{skill.name}</h3>
                            {skill.yearsOfExperience && (
                              <p className="text-sm text-gray-400">
                                {skill.yearsOfExperience} years
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(skill.id)}
                              className="p-2 hover:bg-red-500/10 text-red-400 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Proficiency</span>
                            <span className="text-primary font-semibold">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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

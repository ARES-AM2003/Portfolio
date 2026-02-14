'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    phone: '',
    email: '',
    avatar: '',
    heroImage: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    resumeUrl: '',
  })

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setFormData({
            name: data.name || '',
            title: data.title || '',
            bio: data.bio || '',
            location: data.location || '',
            phone: data.phone || '',
            email: data.email || '',
            avatar: data.avatar || '',
            heroImage: data.heroImage || '',
            githubUrl: data.github || '',
            linkedinUrl: data.linkedin || '',
            twitterUrl: data.twitter || '',
            resumeUrl: data.resumeUrl || '',
          })
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Clear all client-side caches
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('profileCache')
          sessionStorage.removeItem('heroCache')
          sessionStorage.clear() // Clear all session storage
        }
        
        toast.success('Profile updated successfully!')
        // Hard reload to bypass all caches
        window.location.href = window.location.href
      } else {
        toast.error('Failed to update profile: ' + result.error)
      }
    } catch (error) {
      toast.error('Error updating profile')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-gray-400">Loading profile...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your portfolio profile and images</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Section */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Images</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Profile Avatar
                  </label>
                  {formData.avatar && (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden ring-4 ring-primary/30 mb-4">
                      <Image
                        src={formData.avatar}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="mt-2 text-xs text-gray-500">Enter image URL or upload to an image hosting service</p>
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Hero Background
                  </label>
                  {formData.heroImage && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={formData.heroImage}
                        alt="Hero"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    name="heroImage"
                    value={formData.heroImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://example.com/hero-background.jpg"
                  />
                  <p className="mt-2 text-xs text-gray-500">Enter image URL or upload to an image hosting service</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Social Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
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

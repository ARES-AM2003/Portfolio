'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState } from 'react'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    siteName: 'My Portfolio',
    siteDescription: 'Backend Developer Portfolio',
    enableComments: true,
    enableAnalytics: false,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // TODO: API call to save settings
    setTimeout(() => {
      setSaving(false)
      alert('Settings saved successfully!')
    }, 1000)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Configure your portfolio settings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={formData.siteDescription}
                    onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Features</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableComments}
                    onChange={(e) => setFormData({...formData, enableComments: e.target.checked})}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary focus:ring-primary"
                  />
                  <span className="text-white">Enable Comments</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableAnalytics}
                    onChange={(e) => setFormData({...formData, enableAnalytics: e.target.checked})}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary focus:ring-primary"
                  />
                  <span className="text-white">Enable Analytics</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

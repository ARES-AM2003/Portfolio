'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { Eye, MessageSquare, Briefcase, TrendingUp, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0 })
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [projectsRes, messagesRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/messages')
      ])
      
      if (projectsRes.ok && messagesRes.ok) {
        const projects = await projectsRes.json()
        const messages = await messagesRes.json()
        setStats({
          projects: projects.length || 0,
          messages: messages.filter((m: any) => m.status === 'new').length || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = async () => {
    setClearing(true)
    try {
      const response = await fetch('/api/admin/cache', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Clear all sessionStorage caches
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('profileCache')
          sessionStorage.removeItem('heroCache')
        }
        alert('✅ Cache cleared successfully! Page will reload.')
        window.location.reload()
      } else {
        alert('❌ Failed to clear cache: ' + result.error)
      }
    } catch (error) {
      alert('❌ Error clearing cache')
      console.error(error)
    } finally {
      setClearing(false)
    }
  }
  
  const statCards = [
    { label: 'Total Projects', value: stats.projects.toString(), icon: Briefcase, color: 'text-blue-400' },
    { label: 'Page Views', value: '2,543', icon: Eye, color: 'text-green-400' },
    { label: 'New Messages', value: stats.messages.toString(), icon: MessageSquare, color: 'text-purple-400' },
    { label: 'This Month', value: '+23%', icon: TrendingUp, color: 'text-primary' },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here&apos;s your portfolio overview.</p>
            </div>
            <button
              onClick={handleClearCache}
              disabled={clearing}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} className={clearing ? 'animate-spin' : ''} />
              {clearing ? 'Clearing...' : 'Clear Cache'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-effect rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="glass-effect rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/projects"
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 hover:scale-105"
              >
                <Briefcase className="text-primary mb-2" size={24} />
                <h3 className="text-white font-semibold mb-1">Add Project</h3>
                <p className="text-sm text-gray-400">Create a new portfolio project</p>
              </a>
              <a
                href="/admin/profile"
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 hover:scale-105"
              >
                <Eye className="text-green-400 mb-2" size={24} />
                <h3 className="text-white font-semibold mb-1">Update Profile</h3>
                <p className="text-sm text-gray-400">Edit your bio and images</p>
              </a>
              <a
                href="/admin/messages"
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="text-purple-400 mb-2" size={24} />
                <h3 className="text-white font-semibold mb-1">View Messages</h3>
                <p className="text-sm text-gray-400">Check new contact inquiries</p>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New message from John Doe', time: '2 hours ago', type: 'message' },
                { action: 'Project "API Gateway" viewed 50 times', time: '5 hours ago', type: 'view' },
                { action: 'New skill "GraphQL" added', time: '1 day ago', type: 'update' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

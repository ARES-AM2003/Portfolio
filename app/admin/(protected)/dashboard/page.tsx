import AdminSidebar from '@/components/AdminSidebar'
import { Eye, MessageSquare, Briefcase, TrendingUp } from 'lucide-react'
import prisma from '@/lib/prisma'

async function getStats() {
  try {
    const [projectCount, messageCount] = await Promise.all([
      prisma.project.count(),
      prisma.contactMessage.count({ where: { status: 'new' } }),
    ])
    
    return {
      projects: projectCount,
      messages: messageCount,
    }
  } catch (error) {
    return { projects: 0, messages: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()
  
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's your portfolio overview.</p>
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

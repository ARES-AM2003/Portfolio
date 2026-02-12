'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState, useEffect } from 'react'
import { Mail, Clock, CheckCircle } from 'lucide-react'

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
            <p className="text-gray-400">Contact form submissions</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <Mail className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-xl text-gray-400 mb-2">No messages yet</p>
              <p className="text-gray-500">Messages will appear here when visitors contact you</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="glass-effect rounded-xl p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="text-primary" size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                        <p className="text-sm text-gray-400">{message.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={16} />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                      {message.status === 'new' ? (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          New
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/10 text-gray-400 text-xs font-semibold rounded-full">
                          Read
                        </span>
                      )}
                    </div>
                  </div>

                  {message.subject && (
                    <p className="text-sm font-semibold text-gray-300 mb-2">
                      Subject: {message.subject}
                    </p>
                  )}

                  <p className="text-gray-300 mb-4">{message.message}</p>

                  <div className="flex gap-2">
                    <a
                      href={`mailto:${message.email}`}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm"
                    >
                      Reply
                    </a>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm flex items-center gap-2">
                      <CheckCircle size={16} />
                      Mark as Read
                    </button>
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

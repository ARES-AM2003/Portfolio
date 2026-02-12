'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  Briefcase as Experience, 
  MessageSquare, 
  Settings, 
  LogOut,
  User
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/profile', icon: User, label: 'Profile' },
    { href: '/admin/projects', icon: Briefcase, label: 'Projects' },
    { href: '/admin/skills', icon: Award, label: 'Skills' },
    { href: '/admin/experience', icon: Experience, label: 'Experience' },
    { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 bg-background-surface border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        <p className="text-sm text-gray-400 mt-1">Portfolio Management</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { Award, Code, Database, Server } from 'lucide-react'

export default function AboutPreview() {
  const skills = [
    { icon: Server, label: 'Backend Development', color: 'text-blue-400' },
    { icon: Database, label: 'Database Design', color: 'text-green-400' },
    { icon: Code, label: 'API Architecture', color: 'text-purple-400' },
    { icon: Award, label: 'Best Practices', color: 'text-primary' },
  ]

  return (
    <section id="about" className="min-h-screen bg-background-surface py-20 px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">About Me</h2>
          <p className="text-xl text-gray-400">Backend developer with a passion for scalable systems</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-6">My Story</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              I&apos;m a passionate backend developer with over 5 years of experience building scalable, 
              high-performance systems. My expertise lies in designing robust APIs, implementing 
              microservices architectures, and optimizing database performance.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              I specialize in Node.js, Python, and cloud infrastructure, always staying up-to-date 
              with the latest technologies and best practices in backend development.
            </p>
            <Link
              href="/about"
              className="inline-block mt-6 px-6 py-3 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {skills.map((skill, index) => {
              const Icon = skill.icon
              return (
                <div
                  key={index}
                  className="glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300"
                >
                  <Icon className={`${skill.color} mb-4`} size={40} />
                  <h4 className="text-lg font-semibold text-white">{skill.label}</h4>
                </div>
              )
            })}
          </div>
        </div>

        {/* Experience Timeline Preview */}
        <div className="glass-effect rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Experience Highlights</h3>
          <div className="space-y-4">
            {[
              { year: '2024 - Present', title: 'Senior Backend Developer', company: 'Tech Corp' },
              { year: '2022 - 2024', title: 'Backend Developer', company: 'StartupXYZ' },
              { year: '2020 - 2022', title: 'Junior Developer', company: 'WebSolutions' },
            ].map((exp, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="w-24 text-primary font-semibold text-sm">{exp.year}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{exp.title}</h4>
                  <p className="text-gray-400 text-sm">{exp.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

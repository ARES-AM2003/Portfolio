import Sidebar from '@/components/Sidebar'
import prisma from '@/lib/prisma'

async function getUserProfile() {
  try {
    const user = await prisma.user.findFirst()
    return user
  } catch (error) {
    return null
  }
}

async function getSkills() {
  try {
    const skills = await prisma.skill.findMany({
      include: { technologies: true },
      orderBy: { category: 'asc' },
    })
    
    // Group skills by category with full skill data
    const grouped: Record<string, any[]> = {}
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push({
        name: skill.name,
        proficiency: skill.proficiency,
        yearsOfExperience: skill.yearsOfExperience,
      })
    })
    
    return grouped
  } catch (error) {
    console.error('Error fetching skills:', error)
    return {}
  }
}

async function getExperience() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    })
    return experience
  } catch (error) {
    console.error('Error fetching experience:', error)
    return []
  }
}

export default async function AboutPage() {
  const profile = await getUserProfile()
  const skills = await getSkills()
  const experience = await getExperience()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        <section className="relative z-10 min-h-screen p-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-8">About Me</h1>
            
            <div className="glass-effect rounded-2xl p-8 mb-8">
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {profile?.bio || "I'm a passionate backend developer with expertise in building scalable, high-performance systems. With over 5 years of experience, I've worked on various projects ranging from microservices architectures to real-time APIs."}
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                My focus is on creating robust backend solutions that power modern applications. 
                I specialize in Node.js, Python, and cloud infrastructure, always staying up-to-date 
                with the latest technologies and best practices.
              </p>
            </div>

            {/* Skills Section */}
            <div className="glass-effect rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-6">Technical Skills</h2>
              
              {Object.keys(skills).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h3 className="text-xl font-semibold text-primary mb-4">{category}</h3>
                      <div className="space-y-3">
                        {(skillList as any[]).map((skill) => (
                          <div key={skill.name} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{skill.name}</span>
                              {skill.yearsOfExperience && (
                                <span className="text-sm text-gray-400">
                                  {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
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
              ) : (
                <p className="text-gray-400">No skills added yet. Add skills from the admin panel.</p>
              )}
            </div>

            {/* Experience Timeline */}
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8">Experience</h2>
              
              {experience.length > 0 ? (
                <div className="space-y-8">
                  {experience.map((exp: any, index: number) => {
                    const startYear = new Date(exp.startDate).getFullYear()
                    const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'
                    
                    return (
                      <div key={exp.id || index} className="flex gap-6">
                        <div className="flex-shrink-0 w-32 text-primary font-semibold">
                          {startYear} - {endYear}
                        </div>
                        <div className="flex-1 pb-8 border-l-2 border-white/10 pl-6">
                          <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                          <p className="text-gray-400 mb-2">{exp.company}</p>
                          <p className="text-gray-300">{exp.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400">No experience added yet. Add your work history from the admin panel.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

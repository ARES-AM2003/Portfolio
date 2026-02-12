import Sidebar from '@/components/Sidebar'
import { Download } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      title: 'API Development',
      description: 'Building scalable RESTful and GraphQL APIs with proper authentication, rate limiting, and documentation.',
      features: ['REST & GraphQL APIs', 'Authentication & Authorization', 'API Documentation', 'Rate Limiting'],
    },
    {
      title: 'Microservices Architecture',
      description: 'Designing and implementing microservices-based systems for better scalability and maintainability.',
      features: ['Service Design', 'Inter-service Communication', 'Service Discovery', 'Load Balancing'],
    },
    {
      title: 'Database Design',
      description: 'Creating efficient database schemas and optimizing queries for high-performance applications.',
      features: ['Schema Design', 'Query Optimization', 'Migration Strategies', 'Data Modeling'],
    },
    {
      title: 'DevOps & Deployment',
      description: 'Setting up CI/CD pipelines and containerized deployments for automated and reliable releases.',
      features: ['CI/CD Pipelines', 'Docker & Kubernetes', 'Cloud Deployment', 'Monitoring'],
    },
    {
      title: 'Performance Optimization',
      description: 'Analyzing and optimizing backend systems for improved speed, efficiency, and scalability.',
      features: ['Code Profiling', 'Caching Strategies', 'Load Testing', 'System Optimization'],
    },
    {
      title: 'Technical Consulting',
      description: 'Providing expert advice on technology stack selection, architecture decisions, and best practices.',
      features: ['Architecture Review', 'Tech Stack Selection', 'Code Review', 'Best Practices'],
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <section className="min-h-screen p-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">Services</h1>
              <p className="text-xl text-gray-400">What I can do for you</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="glass-effect rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="glass-effect rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start a Project?</h2>
              <p className="text-xl text-gray-400 mb-8">
                Let's discuss how I can help bring your backend vision to life
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-4 bg-primary hover:bg-primary-dark text-background-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Get in Touch
                </a>
                <a
                  href="/resume"
                  className="flex items-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-primary text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/5"
                >
                  <Download size={20} />
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

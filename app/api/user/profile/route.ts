import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('=== FETCHING USER PROFILE ===')
    console.log('Database URL:', process.env.DATABASE_URL)
    const user = await prisma.user.findFirst()
    console.log('User found:', user ? user.name : 'No user')
    console.log('User data:', user ? JSON.stringify({ name: user.name, title: user.title, avatar: user.avatar }) : 'null')
    
    if (!user) {
      // Return default data if no user exists
      return NextResponse.json({
        name: 'Alex Smith',
        title: 'Freelancer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1920&h=1080&fit=crop',
        bio: 'Building scalable backend systems and APIs',
        email: 'alex@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      })
    }

    const response = NextResponse.json({
      name: user.name,
      title: user.title,
      avatar: user.avatar,
      heroImage: user.heroImage,
      bio: user.bio,
      email: user.email,
      phone: user.phone,
      location: user.location,
      github: user.githubUrl,
      linkedin: user.linkedinUrl,
      twitter: user.twitterUrl,
    })
    
    // Ensure no caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Fetch profile error:', error)
    // Return default data on error
    return NextResponse.json({
      name: 'Alex Smith',
      title: 'Freelancer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1920&h=1080&fit=crop',
      bio: 'Building scalable backend systems and APIs',
      email: 'alex@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    })
  }
}

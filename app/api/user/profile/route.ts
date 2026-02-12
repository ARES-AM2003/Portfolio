import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    
    if (!user) {
      // Return default data if no user exists
      return NextResponse.json({
        name: 'Alex Smith',
        title: 'Freelancer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1920&h=1080&fit=crop',
        bio: 'Building scalable backend systems and APIs',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      })
    }

    return NextResponse.json({
      name: user.name,
      title: user.title,
      avatar: user.avatar,
      heroImage: user.heroImage,
      bio: user.bio,
      github: user.githubUrl,
      linkedin: user.linkedinUrl,
      twitter: user.twitterUrl,
    })
  } catch (error) {
    console.error('Fetch profile error:', error)
    // Return default data on error
    return NextResponse.json({
      name: 'Alex Smith',
      title: 'Freelancer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1920&h=1080&fit=crop',
      bio: 'Building scalable backend systems and APIs',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    })
  }
}

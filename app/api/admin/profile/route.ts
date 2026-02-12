import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Check if user exists
    let user = await prisma.user.findFirst()
    
    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email || 'admin@example.com',
          password: '', // Not used for display
          name: data.name,
          title: data.title,
          bio: data.bio,
          avatar: data.avatar,
          heroImage: data.heroImage,
          location: data.location,
          phone: data.phone,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
          twitterUrl: data.twitterUrl,
          resumeUrl: data.resumeUrl,
        }
      })
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          title: data.title,
          bio: data.bio,
          avatar: data.avatar,
          heroImage: data.heroImage,
          location: data.location,
          phone: data.phone,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
          twitterUrl: data.twitterUrl,
          resumeUrl: data.resumeUrl,
        }
      })
    }

    return NextResponse.json({ success: true, message: 'Profile updated', data: user })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

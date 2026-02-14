import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    console.log('=== PROFILE UPDATE START ===')
    console.log('Request data:', JSON.stringify(data, null, 2))
    console.log('Database URL:', process.env.DATABASE_URL)
    
    // Check if user exists
    let user = await prisma.user.findFirst()
    console.log('Existing user found:', user ? 'Yes (ID: ' + user.id + ')' : 'No')
    
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
      console.log('User updated successfully:', user.name)
    }
    
    // Verify the update by reading it back
    const verifyUser = await prisma.user.findFirst()
    console.log('Verification - Current user in DB:', {
      name: verifyUser?.name,
      title: verifyUser?.title,
      avatar: verifyUser?.avatar
    })
    console.log('=== PROFILE UPDATE END ===')

    // Revalidate all pages that use profile data
    revalidatePath('/', 'layout') // Revalidate entire site layout
    revalidatePath('/api/user/profile') // Revalidate profile API
    revalidatePath('/about')
    revalidatePath('/admin/profile')

    return NextResponse.json({ success: true, message: 'Profile updated', data: user })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

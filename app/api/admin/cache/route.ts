import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Revalidate all main pages
    revalidatePath('/', 'layout')
    revalidatePath('/about')
    revalidatePath('/projects')
    revalidatePath('/services')
    revalidatePath('/contact')
    revalidatePath('/api/user/profile')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully',
      timestamp: Date.now() // Send timestamp to force client refresh
    })
  } catch (error) {
    console.error('Cache clear error:', error)
    return NextResponse.json({ 
      error: 'Failed to clear cache' 
    }, { status: 500 })
  }
}

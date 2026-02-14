import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendContactNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || 'Contact Form Submission',
        message: data.message,
        status: 'new',
      }
    })
    
    // Send email notification
    try {
      await sendContactNotification({
        name: data.name,
        email: data.email,
        subject: data.subject || 'Contact Form Submission',
        message: data.message,
      })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({ success: true, message: 'Message sent successfully', data: message })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
  },
})

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER, // Send to yourself
    replyTo: email, // User's email for easy reply
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: bold;">New Contact Message</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 25px; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #00ff88; border-radius: 4px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
            <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 18px; font-weight: bold;">${name}</p>
          </div>
          
          <div style="margin-bottom: 25px; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #00ff88; border-radius: 4px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
            <p style="margin: 5px 0 0 0;">
              <a href="mailto:${email}" style="color: #00ff88; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
            </p>
          </div>
          
          <div style="margin-bottom: 25px; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #00ff88; border-radius: 4px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
            <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 500;">${subject}</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
               style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%); color: #1a1a1a; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,255,136,0.3);">
              Reply to ${name}
            </a>
          </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 13px;">
          <p style="margin: 0;">Received: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
          <p style="margin: 5px 0 0 0;">Portfolio Contact Form Notification</p>
        </div>
      </div>
    `,
    text: `
New Contact Message

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Received: ${new Date().toLocaleString()}
    `.trim(),
  }

  await transporter.sendMail(mailOptions)
}

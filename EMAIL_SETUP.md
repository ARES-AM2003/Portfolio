# Gmail Email Notifications Setup

This guide will help you set up Gmail to send email notifications when someone submits the contact form.

## Prerequisites
- A Gmail account
- Two-factor authentication enabled on your Google account

## Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account Security Settings](https://myaccount.google.com/security)
2. Under "Signing in to Google", enable "2-Step Verification"
3. Follow the prompts to set it up

## Step 2: Generate App Password

1. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **"Mail"** from the "Select app" dropdown
3. Select **"Other (Custom name)"** from the "Select device" dropdown
4. Enter a name like "Portfolio Contact Form"
5. Click **"Generate"**
6. Google will show you a 16-character password - **copy this immediately**

## Step 3: Configure Environment Variables

1. Open your `.env` file in the project root
2. Update the following variables:

```env
GMAIL_USER="your-actual-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"  # The 16-character password from step 2
```

**Important:** Use the **App Password**, not your regular Gmail password!

## Step 4: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the contact page: http://localhost:3001/contact

3. Fill out and submit the contact form

4. Check your Gmail inbox - you should receive a beautifully formatted email notification!

## Email Template Features

The notification email includes:
- **Sender Information**: Name and email (with reply-to functionality)
- **Subject**: The message subject
- **Message Content**: Full message from the sender
- **Quick Reply Button**: One-click reply to the sender
- **Timestamp**: When the message was received
- **Responsive Design**: Looks great on desktop and mobile

## Troubleshooting

### "Invalid login" error
- Make sure you're using the **App Password**, not your regular password
- Ensure 2-Factor Authentication is enabled
- Double-check that the App Password has no spaces when pasted

### Emails not sending
- Check the terminal for error messages
- Verify your Gmail credentials in `.env`
- Make sure you restarted the dev server after updating `.env`
- Check your spam folder

### ECONNREFUSED error
- Check your internet connection
- Gmail may be temporarily blocking the connection - try again in a few minutes
- Some networks block SMTP - try a different network

## Security Notes

- ✅ **Never commit** your `.env` file to version control
- ✅ The `.env` file is already in `.gitignore`
- ✅ Use different App Passwords for development and production
- ✅ You can revoke App Passwords anytime at [Google Account](https://myaccount.google.com/apppasswords)

## Production Deployment

For production on Vercel/Netlify:

1. Add the environment variables to your hosting platform:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`

2. Consider using a dedicated email service for better deliverability:
   - [SendGrid](https://sendgrid.com/) (12,000 free emails/month)
   - [Resend](https://resend.com/) (3,000 free emails/month)
   - [Mailgun](https://www.mailgun.com/) (5,000 free emails/month)

## Alternative: Using SendGrid

If you prefer SendGrid instead of Gmail:

1. Install the package:
   ```bash
   npm install @sendgrid/mail
   ```

2. Update `lib/email.ts` to use SendGrid API
3. Set `SENDGRID_API_KEY` in your `.env`

## Contact

If you have issues with the email setup, check the [Nodemailer documentation](https://nodemailer.com/about/) or create an issue in the repository.

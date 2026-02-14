import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import ScrollToTop from '@/components/ScrollToTop'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Backend Developer Portfolio',
  description: 'Professional backend developer portfolio with admin dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
          <ScrollToTop />
        </Providers>
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  )
}

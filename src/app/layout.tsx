import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodTune - Your Face, Your Music',
  description: 'Smile, Frown, or Stare – Let AI DJ Your Mood',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <div id="app-root" className="app-container">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
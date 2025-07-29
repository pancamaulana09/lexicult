import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LexiCult - Learn Languages Through Culture',
  description: 'Master languages through cultural immersion and AI-powered learning',
  keywords: ['language learning', 'cultural immersion', 'AI tutoring', 'pronunciation'],
  authors: [{ name: 'LexiCult Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>

    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
              {/* <ThemeProvider> */}
                {/* <NotificationProvider> */}
                  {children}
                {/* </NotificationProvider> */}
              {/* </ThemeProvider> */}
        </ErrorBoundary>
      </body>
    </html>
    </ClerkProvider>

  )
}
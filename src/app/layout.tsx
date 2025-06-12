import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Digital Artisan | Creative Developer Portfolio',
  description: 'A highly animated portfolio showcasing modern web development with stunning visual effects, 3D animations, and interactive experiences.',
  keywords: 'portfolio, web developer, animation, 3D, React, Next.js, creative coding',
  authors: [{ name: 'Digital Artisan' }],
  creator: 'Digital Artisan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Digital Artisan | Creative Developer Portfolio',
    description: 'Experience the future of web development through immersive animations and cutting-edge technology.',
    siteName: 'Digital Artisan Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Artisan | Creative Developer Portfolio',
    description: 'Experience the future of web development through immersive animations and cutting-edge technology.',
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${inter.className} antialiased bg-dark-bg text-white overflow-x-hidden`}>
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppHeader } from '@/components/ui/ui-layout'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'CisLunar Commodities Exchange',
  description: 'Invest in the future of space resource extraction',
  openGraph: {
    title: 'CisLunar Commodities Exchange',
    description: 'Invest in the future of space resource extraction',
    images: [
      {
        url: '/cce.png',
        width: 1200,
        height: 630,
        alt: 'CisLunar Commodities Exchange'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CisLunar Commodities Exchange',
    description: 'Invest in the future of space resource extraction',
    images: ['/cce.png']
  },
  icons: {
    icon: [
      { url: '/app/favicon.ico', sizes: 'any' },
      { url: '/app/icon.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/app/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/app/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/app/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/app/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/app/icon.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <AppHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
}

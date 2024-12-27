import { WalletButton } from '@/components/solana/solana-provider'
import { Providers } from '@/components/providers'
import Link from 'next/link'
import './globals.css'

const navigation = [
  { name: '🚀 Deals', href: '/' },
  { name: '💱 Swap', href: '/swaps' },
  { name: '📊 Market', href: '/market' },
  { name: 'ℹ️ About', href: '/about' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-black text-white">
            <header className="border-b border-white/10">
              <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-xl font-bold">
                    CisLunar Commodities Exchange
                  </Link>
                  <div className="flex gap-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <WalletButton />
              </nav>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

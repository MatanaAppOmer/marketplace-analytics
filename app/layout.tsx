import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marketplace Template Analytics',
  description: 'Wix Marketplace template analytics dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-gray-50`}>
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
            <h1 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
              Marketplace Template Analytics
            </h1>
            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/partners" className="text-gray-600 hover:text-blue-600 transition-colors">
                Partners
              </Link>
              <Link href="/templates" className="text-gray-600 hover:text-blue-600 transition-colors">
                Templates
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}

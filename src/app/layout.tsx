import type { Metadata } from 'next'
import { Layout } from '@/components/Layout'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'User Management System',
  description: 'Internal Tool for User Management & Access Control',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}

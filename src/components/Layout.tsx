'use client'

import React from 'react'
import { useTheme } from '@/hooks/useTheme'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) return <>{children}</>

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg dark:from-blue-900 dark:to-blue-950 border-b-4 border-orange-500">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">User Management System</h1>
              <p className="text-blue-100 mt-1">Internal Tool & Access Control</p>
            </div>
            <button
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === 'dark'}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="relative inline-flex h-9 w-16 items-center rounded-full bg-white/20 hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <span className="sr-only">Chuyển light/dark mode</span>
              <span
                className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
                  theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-6 transition-colors">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>&copy; 2026 Internal Tool. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

'use client'

import React from 'react'

interface SkeletonLoaderProps {
  rows?: number
  columns?: number
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 5, columns = 8 }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white dark:bg-gray-800 transition-colors">
        <thead className="bg-blue-600 dark:bg-blue-900 text-white">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

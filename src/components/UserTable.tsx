'use client'

import React from 'react'
import { User } from '@/types'
import { SkeletonLoader } from './SkeletonLoader'

interface UserTableProps {
  users: User[]
  loading: boolean
  onStatusClick: (user: User) => void
  onPermissionsClick: (user: User) => void
  loadingUserId?: string | null
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onStatusClick,
  onPermissionsClick,
  loadingUserId,
}) => {
  if (loading) {
    return <SkeletonLoader rows={5} columns={8} />
  }

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Không có dữ liệu người dùng</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white dark:bg-gray-800 transition-colors">
        <thead className="bg-blue-600 dark:bg-blue-900 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Tên nhân viên</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Mã NV</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Phòng ban</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Chức danh</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Quyền ứng dụng</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.fullName}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.employeeCode}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.department}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.title}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {user.applications?.filter((app) => app.enabled).length ?? 0} / 3
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <button
                  onClick={() => onStatusClick(user)}
                  disabled={loadingUserId === user.id}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded disabled:opacity-50 text-xs transition-colors"
                >
                  {loadingUserId === user.id ? '...' : 'Trạng thái'}
                </button>
                <button
                  onClick={() => onPermissionsClick(user)}
                  disabled={loadingUserId === user.id}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-800 text-white rounded disabled:opacity-50 text-xs transition-colors"
                >
                  {loadingUserId === user.id ? '...' : 'Quyền'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

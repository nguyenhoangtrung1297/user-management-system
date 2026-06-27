'use client'

import React, { useState, useEffect } from 'react'
import { User, Application } from '@/types'
import { APPLICATIONS, MESSAGES } from '@/constants'

interface ApplicationModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onConfirm: (applications: Application[]) => Promise<void>
  loading?: boolean
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [applications, setApplications] = useState<Application[]>([])
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (user?.applications) {
      setApplications(JSON.parse(JSON.stringify(user.applications)))
    }
  }, [user])

  if (!isOpen || !user) return null

  const handleToggle = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, enabled: !app.enabled } : app
      )
    )
  }

  const handleConfirm = async () => {
    if (user.status === 'Inactive' && applications.some((app) => app.enabled)) {
      alert(MESSAGES.INACTIVE_NO_PERMISSION)
      return
    }

    setConfirming(true)
    try {
      await onConfirm(applications)
      onClose()
    } finally {
      setConfirming(false)
    }
  }

  const hasChanges = JSON.stringify(applications) !== JSON.stringify(user.applications)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Gán quyền ứng dụng</h2>
          <p className="text-sm text-gray-600 mt-1">
            {user.fullName} ({user.email})
          </p>
        </div>

        <div className="p-6 space-y-4">
          {user.status === 'Inactive' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Người dùng {user.status} không thể nhận quyền mới
              </p>
            </div>
          )}

          {applications.map((app) => (
            <label
              key={app.id}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={app.enabled}
                onChange={() => handleToggle(app.id)}
                disabled={user.status === 'Inactive'}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="ml-3 font-medium text-gray-900">{app.name}</span>
            </label>
          ))}

          <div className="text-sm text-gray-600 pt-2">
            {applications.filter((app) => app.enabled).length} / {applications.length} ứng dụng được cấp quyền
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={confirming || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming || loading || user.status === 'Inactive' || !hasChanges}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {confirming ? 'Đang xử lý...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

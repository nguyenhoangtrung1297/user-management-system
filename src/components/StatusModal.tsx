'use client'

import React, { useState } from 'react'
import { User, UserStatus } from '@/types'
import { MESSAGES } from '@/constants'

interface StatusModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onConfirm: (status: UserStatus) => Promise<void>
  loading?: boolean
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [confirming, setConfirming] = useState(false)

  if (!isOpen || !user) return null

  const newStatus: UserStatus = user.status === 'Active' ? 'Inactive' : 'Active'

  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await onConfirm(newStatus)
      onClose()
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Xác nhận thay đổi trạng thái</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Người dùng:</strong> {user.fullName} ({user.email})
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Trạng thái hiện tại:</strong>{' '}
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user.status}
              </span>
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Trạng thái mới:</strong>{' '}
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  newStatus === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {newStatus}
              </span>
            </p>
          </div>

          <p className="text-sm text-gray-600">
            {MESSAGES.CONFIRM_STATUS_CHANGE}
          </p>
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
            disabled={confirming || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {confirming ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  )
}

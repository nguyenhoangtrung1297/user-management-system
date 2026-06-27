'use client'

import { useState } from 'react'
import { User, UserStatus, Application } from '@/types'
import { userAPI } from '@/services/api'

interface UseUserActionReturn {
  loadingUserId: string | null
  error: string | null
  updateStatus: (userId: string, status: UserStatus) => Promise<User | null>
  updateApplications: (userId: string, applications: Application[]) => Promise<User | null>
  rollback: (userId: string, originalUser: User) => void
  clearError: () => void
}

export const useUserAction = (): UseUserActionReturn => {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rollbackState, setRollbackState] = useState<Map<string, User>>(new Map())

  const updateStatus = async (userId: string, status: UserStatus): Promise<User | null> => {
    setLoadingUserId(userId)
    setError(null)

    try {
      const response = await userAPI.updateStatus(userId, { status })

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || 'Lỗi cập nhật trạng thái')
        return null
      }
    } catch (err) {
      setError('Lỗi cập nhật trạng thái')
      return null
    } finally {
      setLoadingUserId(null)
    }
  }

  const updateApplications = async (
    userId: string,
    applications: Application[]
  ): Promise<User | null> => {
    setLoadingUserId(userId)
    setError(null)

    try {
      const response = await userAPI.updateApplications(userId, { applications })

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || 'Lỗi cập nhật quyền ứng dụng')
        return null
      }
    } catch (err) {
      setError('Lỗi cập nhật quyền ứng dụng')
      return null
    } finally {
      setLoadingUserId(null)
    }
  }

  const rollback = (userId: string, originalUser: User) => {
    setRollbackState((prev) => new Map(prev).set(userId, originalUser))
  }

  const clearError = () => {
    setError(null)
  }

  return {
    loadingUserId,
    error,
    updateStatus,
    updateApplications,
    rollback,
    clearError,
  }
}

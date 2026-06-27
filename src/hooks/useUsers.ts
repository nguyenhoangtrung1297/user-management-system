'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { User, UserFilters } from '@/types'
import { userAPI } from '@/services/api'

interface UseUsersReturn {
  users: User[]
  total: number
  loading: boolean
  error: string | null
  success: boolean
  refetch: (filters: UserFilters) => Promise<void>
  setSuccess: (value: boolean) => void
  optimisticUpdate: (user: User) => void
  rollback: () => void
}

export const useUsers = (initialFilters: UserFilters): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const backupUsersRef = useRef<User[]>([])

  const refetch = useCallback(async (filters: UserFilters) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await userAPI.getUsers(filters)

      if (response.success && response.data) {
        setUsers(response.data.users)
        setTotal(response.data.total)
      } else {
        setError(response.error || 'Lỗi khi tải dữ liệu')
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [])

  const optimisticUpdate = useCallback((updatedUser: User) => {
    backupUsersRef.current = [...users]
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    )
  }, [users])

  const rollback = useCallback(() => {
    if (backupUsersRef.current.length > 0) {
      setUsers(backupUsersRef.current)
      backupUsersRef.current = []
    }
  }, [])

  useEffect(() => {
    refetch(initialFilters)
  }, [])

  return {
    users,
    total,
    loading,
    error,
    success,
    refetch,
    setSuccess,
    optimisticUpdate,
    rollback,
  }
}

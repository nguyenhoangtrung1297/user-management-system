'use client'

import { useState, useCallback, useEffect } from 'react'
import { UserTable } from '@/components/UserTable'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { ImportModal } from '@/components/ImportModal'
import { StatusModal } from '@/components/StatusModal'
import { ApplicationModal } from '@/components/ApplicationModal'
import { useUsers } from '@/hooks/useUsers'
import { useImport } from '@/hooks/useImport'
import { useUserAction } from '@/hooks/useUserAction'
import { User, UserFilters, UserStatus, Application } from '@/types'
import { PAGINATION_LIMIT, MESSAGES } from '@/constants'

export default function Home() {
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    department: '',
    status: '',
    page: 1,
    limit: PAGINATION_LIMIT,
  })

  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { users, total, loading, error, success, refetch, setSuccess, optimisticUpdate, rollback } = useUsers(filters)
  const importHook = useImport()
  const userAction = useUserAction()

  const totalPages = Math.ceil(total / PAGINATION_LIMIT)

  const handleSearch = useCallback(
    (search: string, department: string, status: UserStatus | '') => {
      setFilters((prev) => ({
        ...prev,
        search,
        department,
        status,
        page: 1,
      }))
    },
    []
  )

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }))
  }, [])

  const handleStatusClick = (user: User) => {
    setSelectedUser(user)
    setShowStatusModal(true)
  }

  const handlePermissionsClick = (user: User) => {
    setSelectedUser(user)
    setShowApplicationModal(true)
  }

  const handleStatusConfirm = async (status: UserStatus) => {
    if (!selectedUser) return

    const optimisticUser = { ...selectedUser, status }
    optimisticUpdate(optimisticUser)

    const result = await userAction.updateStatus(selectedUser.id, status)

    if (result) {
      setSuccessMessage(MESSAGES.STATUS_UPDATE_SUCCESS)
      setShowStatusModal(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    } else {
      rollback()
      setErrorMessage(userAction.error || MESSAGES.STATUS_UPDATE_ERROR)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleApplicationConfirm = async (applications: Application[]) => {
    if (!selectedUser) return

    const optimisticUser = { ...selectedUser, applications }
    optimisticUpdate(optimisticUser)

    const result = await userAction.updateApplications(selectedUser.id, applications)

    if (result) {
      setSuccessMessage(MESSAGES.PERMISSION_UPDATE_SUCCESS)
      setShowApplicationModal(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    } else {
      rollback()
      setErrorMessage(userAction.error || MESSAGES.PERMISSION_UPDATE_ERROR)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleImportSuccess = async () => {
    await refetch(filters)
    importHook.reset()
    setShowImportModal(false)
    setSuccessMessage(MESSAGES.IMPORT_SUCCESS)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  useEffect(() => {
    refetch(filters)
  }, [filters])

  useEffect(() => {
    if (success) {
      setSuccess(false)
    }
  }, [success, setSuccess])

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex justify-between items-center transition-colors">
          <span>✓ {successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex justify-between items-center transition-colors">
          <span>✗ {errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý người dùng</h1>
        <button
          onClick={() => setShowImportModal(true)}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-white rounded-lg font-medium transition-colors"
        >
          + Import Excel/CSV
        </button>
      </div>

      {/* Search & Filter */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* User Table */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg transition-colors">
          ✗ {error}
        </div>
      )}

      <UserTable
        users={users}
        loading={loading}
        onStatusClick={handleStatusClick}
        onPermissionsClick={handlePermissionsClick}
        loadingUserId={userAction.loadingUserId}
      />

      {/* Pagination */}
      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        disabled={loading}
      />

      {/* Modals */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false)
          importHook.reset()
        }}
        onFileSelect={importHook.handleFileSelect}
        importedData={importHook.importedData}
        validationErrors={importHook.validationErrors}
        isValid={importHook.isValid}
        loading={importHook.loading}
        error={importHook.error}
        onImport={async () => {
          const ok = await importHook.handleImport()
          if (ok) {
            await handleImportSuccess()
          }
        }}
        success={importHook.success}
      />

      <StatusModal
        isOpen={showStatusModal}
        user={selectedUser}
        onClose={() => {
          setShowStatusModal(false)
          setSelectedUser(null)
        }}
        onConfirm={handleStatusConfirm}
        loading={userAction.loadingUserId === selectedUser?.id}
      />

      <ApplicationModal
        isOpen={showApplicationModal}
        user={selectedUser}
        onClose={() => {
          setShowApplicationModal(false)
          setSelectedUser(null)
        }}
        onConfirm={handleApplicationConfirm}
        loading={userAction.loadingUserId === selectedUser?.id}
      />
    </div>
  )
}

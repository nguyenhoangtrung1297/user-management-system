'use client'

import { useState } from 'react'
import { User, ImportValidationError } from '@/types'
import { processImportData } from '@/utils/importProcessing'
import { userAPI } from '@/services/api'

interface UseImportReturn {
  importedData: Partial<User>[]
  validationErrors: ImportValidationError[]
  isValid: boolean
  loading: boolean
  error: string | null
  success: boolean
  handleFileSelect: (file: File) => Promise<void>
  handleImport: () => Promise<boolean>
  reset: () => void
}

export const useImport = (): UseImportReturn => {
  const [importedData, setImportedData] = useState<Partial<User>[]>([])
  const [validationErrors, setValidationErrors] = useState<ImportValidationError[]>([])
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileSelect = async (file: File) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await processImportData(file)
      setImportedData(result.data)
      setValidationErrors(result.errors)
      setIsValid(result.isValid)
    } catch (err) {
      setError('Lỗi khi xử lý file. Vui lòng kiểm tra định dạng file.')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (): Promise<boolean> => {
    if (!isValid) {
      setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra các lỗi.')
      return false
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await userAPI.importUsers({ users: importedData })

      if (response.success) {
        setSuccess(true)
        setImportedData([])
        setValidationErrors([])
        setIsValid(false)
        return true
      } else {
        setError(response.error || 'Lỗi khi nhập dữ liệu')
        return false
      }
    } catch (err) {
      setError('Lỗi khi nhập dữ liệu')
      return false
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setImportedData([])
    setValidationErrors([])
    setIsValid(false)
    setError(null)
    setSuccess(false)
  }

  return {
    importedData,
    validationErrors,
    isValid,
    loading,
    error,
    success,
    handleFileSelect,
    handleImport,
    reset,
  }
}

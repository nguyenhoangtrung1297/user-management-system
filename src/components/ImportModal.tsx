'use client'

import React, { useRef } from 'react'
import { ImportValidationError, User } from '@/types'
import { downloadTemplate } from '@/utils/importProcessing'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect: (file: File) => Promise<void>
  importedData: Partial<User>[]
  validationErrors: ImportValidationError[]
  isValid: boolean
  loading: boolean
  error: string | null
  onImport: () => Promise<void>
  success: boolean
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  importedData,
  validationErrors,
  isValid,
  loading,
  error,
  onImport,
  success,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onFileSelect(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Import người dùng</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              ✓ Nhập dữ liệu thành công
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              ✗ {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn file Excel/CSV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                disabled={loading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-2">
                Các cột cần có: employeeCode, fullName, email, department, title, status
              </p>
            </div>

            <button
              onClick={() => downloadTemplate()}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ↓ Tải template
            </button>
          </div>

          {importedData.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                Preview dữ liệu ({importedData.length} dòng)
              </h3>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">
                    Lỗi validation ({validationErrors.length} dòng)
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {validationErrors.map((error, idx) => (
                      <div key={idx} className="text-sm text-red-800">
                        <strong>Dòng {error.rowIndex}:</strong> {error.errors.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Mã NV</th>
                      <th className="px-4 py-2 text-left">Tên</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Phòng ban</th>
                      <th className="px-4 py-2 text-left">Chức danh</th>
                      <th className="px-4 py-2 text-left">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedData.slice(0, 5).map((user, idx) => {
                      const hasError = validationErrors.some((e) => e.rowIndex === idx + 2)
                      return (
                        <tr
                          key={idx}
                          className={`border-t ${hasError ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-2">{user.employeeCode}</td>
                          <td className="px-4 py-2">{user.fullName}</td>
                          <td className="px-4 py-2 text-xs">{user.email}</td>
                          <td className="px-4 py-2">{user.department}</td>
                          <td className="px-4 py-2">{user.title}</td>
                          <td className="px-4 py-2">{user.status}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {importedData.length > 5 && (
                <p className="text-xs text-gray-600">
                  ... và {importedData.length - 5} dòng khác
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Đóng
            </button>
            <button
              onClick={onImport}
              disabled={!isValid || loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Đang import...' : 'Import dữ liệu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

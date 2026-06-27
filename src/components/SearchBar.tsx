'use client'

import React, { useState, useCallback, useRef } from 'react'
import { DEPARTMENTS } from '@/constants'
import { UserStatus } from '@/types'
import { debounce } from '@/utils/debounce'

interface SearchBarProps {
  onSearch: (search: string, department: string, status: UserStatus | '') => void
  loading?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState<UserStatus | ''>('')
  const debouncedSearchRef = useRef<ReturnType<typeof debounce>>(
    debounce((s: string, d: string, st: UserStatus | '') => onSearch(s, d, st), 300)
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      debouncedSearchRef.current(value, department, status)
    },
    [department, status]
  )

  const handleDepartmentChange = useCallback(
    (value: string) => {
      setDepartment(value)
      onSearch(search, value, status)
    },
    [search, status, onSearch]
  )

  const handleStatusChange = useCallback(
    (value: UserStatus | '') => {
      setStatus(value)
      onSearch(search, department, value)
    },
    [search, department, onSearch]
  )

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 transition-colors duration-200">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tìm kiếm & Lọc</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tìm kiếm (Tên/Email/Mã NV)
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={loading}
            placeholder="Nhập tên, email hoặc mã nhân viên..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phòng ban
          </label>
          <select
            value={department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 transition-colors duration-200"
          >
            <option value="">Tất cả phòng ban</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as UserStatus | '')}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 transition-colors duration-200"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Active</option>
            <option value="Inactive" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  )
}

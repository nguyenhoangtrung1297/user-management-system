export type ApplicationName = 'E-Office' | 'PPC Tool' | 'HRHire'

export interface Application {
  id: ApplicationName
  name: string
  enabled: boolean
}

export type UserStatus = 'Active' | 'Inactive'

export interface User {
  id: string
  employeeCode: string
  fullName: string
  email: string
  department: string
  title: string
  status: UserStatus
  applications: Application[]
  createdAt: string
  updatedAt: string
}

export interface ImportValidationError {
  rowIndex: number
  errors: string[]
}

export interface ImportPreviewData {
  data: Partial<User>[]
  errors: ImportValidationError[]
  isValid: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface UserFilters {
  search: string
  department: string
  status: UserStatus | ''
  page: number
  limit: number
}

export interface ImportPayload {
  users: Partial<User>[]
}

export interface StatusUpdatePayload {
  status: UserStatus
}

export interface ApplicationUpdatePayload {
  applications: Application[]
}

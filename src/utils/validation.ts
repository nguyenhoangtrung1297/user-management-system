import { EMAIL_REGEX, USER_STATUSES } from '@/constants'
import { ImportValidationError } from '@/types'

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}

export const validateEmployeeCode = (code: string): boolean => {
  return code.trim().length > 0
}

export const validateStatus = (status: string): boolean => {
  return USER_STATUSES.includes(status)
}

export const validateImportRow = (
  row: Record<string, any>,
  rowIndex: number,
  seenEmails: Set<string>,
  seenCodes: Set<string>
): ImportValidationError | null => {
  const errors: string[] = []

  const employeeCode = row.employeeCode?.toString().trim()
  const fullName = row.fullName?.toString().trim()
  const email = row.email?.toString().trim()
  const department = row.department?.toString().trim()
  const title = row.title?.toString().trim()
  const status = row.status?.toString().trim()

  if (!employeeCode) {
    errors.push('Mã nhân viên không được để trống')
  } else if (seenCodes.has(employeeCode)) {
    errors.push('Mã nhân viên đã tồn tại')
  }

  if (!fullName) {
    errors.push('Tên nhân viên không được để trống')
  }

  if (!email) {
    errors.push('Email không được để trống')
  } else if (!validateEmail(email)) {
    errors.push('Email không hợp lệ')
  } else if (seenEmails.has(email)) {
    errors.push('Email đã tồn tại')
  }

  if (!department) {
    errors.push('Phòng ban không được để trống')
  }

  if (!title) {
    errors.push('Chức danh không được để trống')
  }

  if (!status) {
    errors.push('Trạng thái không được để trống')
  } else if (!validateStatus(status)) {
    errors.push('Trạng thái không hợp lệ')
  }

  if (errors.length > 0) {
    return { rowIndex, errors }
  }

  if (employeeCode) seenCodes.add(employeeCode)
  if (email) seenEmails.add(email)

  return null
}

export const validateImportData = (
  data: Record<string, any>[]
): { errors: ImportValidationError[]; isValid: boolean } => {
  const seenEmails = new Set<string>()
  const seenCodes = new Set<string>()
  const errors: ImportValidationError[] = []

  data.forEach((row, index) => {
    const error = validateImportRow(row, index + 2, seenEmails, seenCodes)
    if (error) {
      errors.push(error)
    }
  })

  return {
    errors,
    isValid: errors.length === 0,
  }
}

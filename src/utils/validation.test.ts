/**
 * Unit tests for validation utilities
 * Run with: npm test utils/validation.test.ts
 */

import {
  validateEmail,
  validateEmployeeCode,
  validateStatus,
  validateImportRow,
  validateImportData,
} from './validation'
import { ImportValidationError } from '@/types'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid.email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validateEmployeeCode', () => {
    it('should validate non-empty employee code', () => {
      expect(validateEmployeeCode('EMP001')).toBe(true)
      expect(validateEmployeeCode('ABC123')).toBe(true)
    })

    it('should reject empty employee code', () => {
      expect(validateEmployeeCode('')).toBe(false)
      expect(validateEmployeeCode('   ')).toBe(false)
    })
  })

  describe('validateStatus', () => {
    it('should validate correct status values', () => {
      expect(validateStatus('Active')).toBe(true)
      expect(validateStatus('Inactive')).toBe(true)
    })

    it('should reject invalid status values', () => {
      expect(validateStatus('Pending')).toBe(false)
      expect(validateStatus('active')).toBe(false)
      expect(validateStatus('')).toBe(false)
    })
  })

  describe('validateImportRow', () => {
    const seenEmails = new Set<string>()
    const seenCodes = new Set<string>()

    it('should validate correct row data', () => {
      const row = {
        employeeCode: 'EMP001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'IT',
        title: 'Developer',
        status: 'Active',
      }

      const result = validateImportRow(row, 1, seenEmails, seenCodes)
      expect(result).toBeNull()
    })

    it('should detect missing required fields', () => {
      const row = {
        employeeCode: '',
        fullName: 'John Doe',
        email: '',
        department: 'IT',
        title: 'Developer',
        status: 'Active',
      }

      const result = validateImportRow(row, 1, new Set(), new Set())
      expect(result).not.toBeNull()
      expect(result?.errors.length).toBeGreaterThan(0)
    })

    it('should detect invalid email format', () => {
      const row = {
        employeeCode: 'EMP001',
        fullName: 'John Doe',
        email: 'invalid-email',
        department: 'IT',
        title: 'Developer',
        status: 'Active',
      }

      const result = validateImportRow(row, 1, new Set(), new Set())
      expect(result).not.toBeNull()
      expect(result?.errors.some((e) => e.includes('Email'))).toBe(true)
    })

    it('should detect duplicate email', () => {
      const seenEmails = new Set(['john@example.com'])
      const row = {
        employeeCode: 'EMP001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'IT',
        title: 'Developer',
        status: 'Active',
      }

      const result = validateImportRow(row, 1, seenEmails, new Set())
      expect(result).not.toBeNull()
      expect(result?.errors.some((e) => e.includes('đã tồn tại'))).toBe(true)
    })

    it('should detect invalid status', () => {
      const row = {
        employeeCode: 'EMP001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'IT',
        title: 'Developer',
        status: 'Pending',
      }

      const result = validateImportRow(row, 1, new Set(), new Set())
      expect(result).not.toBeNull()
      expect(result?.errors.some((e) => e.includes('Trạng thái'))).toBe(true)
    })
  })

  describe('validateImportData', () => {
    it('should validate correct dataset', () => {
      const data = [
        {
          employeeCode: 'EMP001',
          fullName: 'John Doe',
          email: 'john@example.com',
          department: 'IT',
          title: 'Developer',
          status: 'Active',
        },
        {
          employeeCode: 'EMP002',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          department: 'HR',
          title: 'Manager',
          status: 'Active',
        },
      ]

      const result = validateImportData(data)
      expect(result.isValid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('should return all validation errors', () => {
      const data = [
        {
          employeeCode: '',
          fullName: '',
          email: 'invalid',
          department: '',
          title: '',
          status: 'Invalid',
        },
      ]

      const result = validateImportData(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0].rowIndex).toBe(2)
    })

    it('should detect duplicate emails across rows', () => {
      const data = [
        {
          employeeCode: 'EMP001',
          fullName: 'John Doe',
          email: 'shared@example.com',
          department: 'IT',
          title: 'Developer',
          status: 'Active',
        },
        {
          employeeCode: 'EMP002',
          fullName: 'Jane Doe',
          email: 'shared@example.com',
          department: 'IT',
          title: 'Developer',
          status: 'Active',
        },
      ]

      const result = validateImportData(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.rowIndex === 3)).toBe(true)
    })
  })
})

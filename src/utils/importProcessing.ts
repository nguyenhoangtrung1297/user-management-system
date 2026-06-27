import { User, ImportValidationError, Application } from '@/types'
import { validateImportData } from './validation'
import * as XLSX from 'xlsx'

export const parseExcelFile = async (
  file: File
): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(new Error('Lỗi khi đọc file Excel'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Lỗi khi đọc file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

export const processImportData = async (
  file: File
): Promise<{
  data: Partial<User>[]
  errors: ImportValidationError[]
  isValid: boolean
}> => {
  const rawData = await parseExcelFile(file)
  const validation = validateImportData(rawData)

  const processedData = rawData.map((row) => ({
    employeeCode: row.employeeCode?.toString().trim() || '',
    fullName: row.fullName?.toString().trim() || '',
    email: row.email?.toString().trim() || '',
    department: row.department?.toString().trim() || '',
    title: row.title?.toString().trim() || '',
    status: (row.status?.toString().trim() || 'Active') as 'Active' | 'Inactive',
    applications: [
      { id: 'E-Office', name: 'E-Office', enabled: false },
      { id: 'PPC Tool', name: 'PPC Tool', enabled: false },
      { id: 'HRHire', name: 'HRHire', enabled: false },
    ] as Application[],
  }))

  return {
    data: processedData,
    errors: validation.errors,
    isValid: validation.isValid,
  }
}

export const downloadTemplate = () => {
  const templateData = [
    {
      employeeCode: 'EMP001',
      fullName: 'Nguyễn Văn A',
      email: 'nguyena@example.com',
      department: 'IT',
      title: 'Developer',
      status: 'Active',
    },
    {
      employeeCode: 'EMP002',
      fullName: 'Trần Thị B',
      email: 'tranb@example.com',
      department: 'HR',
      title: 'Manager',
      status: 'Active',
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(templateData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')

  XLSX.writeFile(workbook, 'user_template.xlsx')
}

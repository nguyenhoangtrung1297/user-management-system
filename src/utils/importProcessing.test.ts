/**
 * Unit test cho luồng xử lý import file thật:
 *   parseExcelFile -> validateImportData -> processImportData
 *
 * Thay vì thao tác tay trên web (vốn phụ thuộc server mock có giả lập lỗi),
 * test này dựng một file .xlsx trong bộ nhớ rồi cho chạy qua đúng pipeline,
 * mô phỏng việc "đưa file từ local vào".
 *
 * Run: npm test utils/importProcessing.test.ts
 */

import { beforeAll, describe, it, expect } from 'vitest'
import * as XLSX from 'xlsx'
import { processImportData } from './importProcessing'

// processImportData dùng FileReader (API trình duyệt) — không có sẵn trong môi
// trường node. Polyfill tối thiểu: đọc ArrayBuffer từ Blob/File rồi gọi onload.
class MockFileReader {
  result: ArrayBuffer | null = null
  onload: ((ev: { target: MockFileReader }) => void) | null = null
  onerror: (() => void) | null = null

  readAsArrayBuffer(file: Blob) {
    file
      .arrayBuffer()
      .then((buf) => {
        this.result = buf
        this.onload?.({ target: this })
      })
      .catch(() => this.onerror?.())
  }
}

beforeAll(() => {
  // @ts-expect-error - gán polyfill cho môi trường test
  globalThis.FileReader = MockFileReader
})

type Row = Record<string, string>

/** Dựng một File .xlsx thật từ danh sách dòng (giống file người dùng tải lên). */
const makeXlsxFile = (rows: Row[]): File => {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
  const buf = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
  return new File([buf], 'users.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

describe('processImportData (đọc file local)', () => {
  it('đọc và validate file hợp lệ', async () => {
    const file = makeXlsxFile([
      {
        employeeCode: 'EMP010',
        fullName: 'Nguyễn Văn X',
        email: 'vanx@example.com',
        department: 'IT',
        title: 'Developer',
        status: 'Active',
      },
      {
        employeeCode: 'EMP011',
        fullName: 'Trần Thị Y',
        email: 'thiy@example.com',
        department: 'HR',
        title: 'Manager',
        status: 'Inactive',
      },
    ])

    const result = await processImportData(file)

    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.data).toHaveLength(2)
    expect(result.data[0].employeeCode).toBe('EMP010')
    // mỗi user import được gán sẵn 3 ứng dụng (chưa cấp quyền)
    expect(result.data[0].applications).toHaveLength(3)
    expect(result.data[0].applications?.every((a) => a.enabled === false)).toBe(true)
  })

  it('báo lỗi với dòng thiếu trường bắt buộc / email sai', async () => {
    const file = makeXlsxFile([
      {
        employeeCode: 'EMP012',
        fullName: 'Hợp Lệ',
        email: 'oke@example.com',
        department: 'IT',
        title: 'Dev',
        status: 'Active',
      },
      {
        employeeCode: '', // thiếu mã NV
        fullName: 'Thiếu Mã',
        email: 'sai-email', // email không hợp lệ
        department: 'IT',
        title: 'Dev',
        status: 'Active',
      },
    ])

    const result = await processImportData(file)

    expect(result.isValid).toBe(false)
    // dòng dữ liệu thứ 2 -> rowIndex = 3 (cộng header + bắt đầu từ 1)
    expect(result.errors.some((e) => e.rowIndex === 3)).toBe(true)
  })

  it('phát hiện email trùng giữa các dòng', async () => {
    const file = makeXlsxFile([
      {
        employeeCode: 'EMP013',
        fullName: 'Người A',
        email: 'trung@example.com',
        department: 'IT',
        title: 'Dev',
        status: 'Active',
      },
      {
        employeeCode: 'EMP014',
        fullName: 'Người B',
        email: 'trung@example.com',
        department: 'HR',
        title: 'Dev',
        status: 'Active',
      },
    ])

    const result = await processImportData(file)

    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.errors.some((m) => m.includes('đã tồn tại')))).toBe(true)
  })

  it('xử lý mã nhân viên dạng số (Excel hay trả về number) và tự trim khoảng trắng', async () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        employeeCode: 1001, // số, không phải chuỗi
        fullName: '  Có Khoảng Trắng  ',
        email: 'num@example.com',
        department: 'IT',
        title: 'Dev',
        status: 'Active',
      },
    ])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
    const buf = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
    const file = new File([buf], 'users.xlsx')

    const result = await processImportData(file)

    expect(result.isValid).toBe(true)
    expect(result.data[0].employeeCode).toBe('1001')
    expect(result.data[0].fullName).toBe('Có Khoảng Trắng')
  })
})

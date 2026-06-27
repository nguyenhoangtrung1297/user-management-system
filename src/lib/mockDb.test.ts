/**
 * Unit test cho việc phát hiện email đã tồn tại trong hệ thống (dùng khi import).
 * Run: npm test lib/mockDb.test.ts
 */

import { describe, it, expect } from 'vitest'
import { findExistingEmails } from './mockDb'

describe('findExistingEmails', () => {
  it('phát hiện email seed đã tồn tại, bỏ qua email mới', () => {
    const result = findExistingEmails([
      'nguyena@example.com', // user EMP001 trong seed -> trùng
      'khong-ton-tai-xyz@example.com', // email mới -> không trùng
    ])
    expect(result).toContain('nguyena@example.com')
    expect(result).not.toContain('khong-ton-tai-xyz@example.com')
  })

  it('so sánh không phân biệt hoa/thường và khoảng trắng', () => {
    const result = findExistingEmails(['  NguyenA@Example.COM  '])
    expect(result).toHaveLength(1)
  })

  it('trả về mảng rỗng khi không có email nào trùng', () => {
    expect(findExistingEmails(['a-moi@x.com', 'b-moi@x.com'])).toEqual([])
  })
})

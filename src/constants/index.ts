export const APPLICATIONS = [
  { id: 'E-Office', name: 'E-Office' },
  { id: 'PPC Tool', name: 'PPC Tool' },
  { id: 'HRHire', name: 'HRHire' },
]

export const USER_STATUSES = ['Active', 'Inactive']

export const DEPARTMENTS = [
  'IT',
  'HR',
  'Finance',
  'Sales',
  'Marketing',
  'Operations',
]

export const PAGINATION_LIMIT = 10

export const MOCK_API_DELAY = 800

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MESSAGES = {
  IMPORT_SUCCESS: 'Nhập dữ liệu thành công',
  IMPORT_ERROR: 'Lỗi khi nhập dữ liệu. Vui lòng kiểm tra và thử lại',
  STATUS_UPDATE_SUCCESS: 'Cập nhật trạng thái thành công',
  STATUS_UPDATE_ERROR: 'Lỗi cập nhật trạng thái',
  PERMISSION_UPDATE_SUCCESS: 'Cập nhật quyền ứng dụng thành công',
  PERMISSION_UPDATE_ERROR: 'Lỗi cập nhật quyền ứng dụng',
  INACTIVE_NO_PERMISSION: 'Không thể cấp quyền cho người dùng Inactive',
  CONFIRM_STATUS_CHANGE: 'Xác nhận thay đổi trạng thái?',
  CONFIRM_PERMISSION_CHANGE: 'Xác nhận thay đổi quyền ứng dụng?',
}

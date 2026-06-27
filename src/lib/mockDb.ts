import { User, Application, UserStatus } from '@/types'
import fs from 'fs'
import path from 'path'

// Kho dữ liệu mock dùng chung cho tất cả API route.
// Dữ liệu được lưu ra file JSON nên tồn tại qua các lần restart server
// (thay đổi từ PATCH/POST sẽ được ghi xuống đĩa và GET đọc lại).
const DATA_FILE = path.join(process.cwd(), '.mock-data.json')

const now = Date.now()
const day = 24 * 60 * 60 * 1000

const seedUsers: User[] = [
  {
    id: '1',
    employeeCode: 'EMP001',
    fullName: 'Nguyễn Văn A',
    email: 'nguyena@example.com',
    department: 'IT',
    title: 'Senior Developer',
    status: 'Active',
    applications: [
      { id: 'E-Office', name: 'E-Office', enabled: true },
      { id: 'PPC Tool', name: 'PPC Tool', enabled: true },
      { id: 'HRHire', name: 'HRHire', enabled: false },
    ],
    createdAt: new Date(now - 30 * day).toISOString(),
    updatedAt: new Date(now).toISOString(),
  },
  {
    id: '2',
    employeeCode: 'EMP002',
    fullName: 'Trần Thị B',
    email: 'tranb@example.com',
    department: 'HR',
    title: 'HR Manager',
    status: 'Active',
    applications: [
      { id: 'E-Office', name: 'E-Office', enabled: true },
      { id: 'PPC Tool', name: 'PPC Tool', enabled: false },
      { id: 'HRHire', name: 'HRHire', enabled: true },
    ],
    createdAt: new Date(now - 60 * day).toISOString(),
    updatedAt: new Date(now).toISOString(),
  },
  {
    id: '3',
    employeeCode: 'EMP003',
    fullName: 'Lê Văn C',
    email: 'levanc@example.com',
    department: 'Finance',
    title: 'Accountant',
    status: 'Inactive',
    applications: [
      { id: 'E-Office', name: 'E-Office', enabled: false },
      { id: 'PPC Tool', name: 'PPC Tool', enabled: false },
      { id: 'HRHire', name: 'HRHire', enabled: false },
    ],
    createdAt: new Date(now - 90 * day).toISOString(),
    updatedAt: new Date(now).toISOString(),
  },
  {
    id: '4',
    employeeCode: 'EMP004',
    fullName: 'Phạm Thị D',
    email: 'phamthid@example.com',
    department: 'Sales',
    title: 'Sales Manager',
    status: 'Active',
    applications: [
      { id: 'E-Office', name: 'E-Office', enabled: true },
      { id: 'PPC Tool', name: 'PPC Tool', enabled: false },
      { id: 'HRHire', name: 'HRHire', enabled: false },
    ],
    createdAt: new Date(now - 120 * day).toISOString(),
    updatedAt: new Date(now).toISOString(),
  },
  {
    id: '5',
    employeeCode: 'EMP005',
    fullName: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    department: 'Marketing',
    title: 'Marketing Specialist',
    status: 'Active',
    applications: [
      { id: 'E-Office', name: 'E-Office', enabled: true },
      { id: 'PPC Tool', name: 'PPC Tool', enabled: true },
      { id: 'HRHire', name: 'HRHire', enabled: true },
    ],
    createdAt: new Date(now - 150 * day).toISOString(),
    updatedAt: new Date(now).toISOString(),
  },
  {
    id: '6',
    employeeCode: 'EMP006',
    fullName: 'Dương Thị F',
    email: 'duongthif@example.com',
    department: 'IT',
    title: 'QA Engineer',
    status: 'Active',
    applications: [
      { id: 'E-Office', name: 'E-Office', enabled: true },
      { id: 'PPC Tool', name: 'PPC Tool', enabled: true },
      { id: 'HRHire', name: 'HRHire', enabled: false },
    ],
    createdAt: new Date(now - 180 * day).toISOString(),
    updatedAt: new Date(now).toISOString(),
  },
]

// Đọc dữ liệu từ file nếu có, ngược lại dùng seed mặc định (và ghi file lần đầu).
const loadUsers = (): User[] => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as User[]
    }
  } catch {
    // file hỏng -> rơi về seed
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedUsers, null, 2), 'utf-8')
  } catch {
    // môi trường chỉ đọc -> bỏ qua, vẫn chạy bằng dữ liệu trong RAM
  }
  return seedUsers
}

export const mockUsers: User[] = loadUsers()

const persist = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(mockUsers, null, 2), 'utf-8')
  } catch {
    // bỏ qua nếu không ghi được
  }
}

export const findUserById = (id: string): User | undefined =>
  mockUsers.find((u) => u.id === id)

// Trả về danh sách email (trong số emails truyền vào) ĐÃ tồn tại trong hệ thống.
// So sánh không phân biệt hoa/thường và bỏ khoảng trắng thừa.
export const findExistingEmails = (emails: string[]): string[] => {
  const existing = new Set(
    mockUsers.map((u) => u.email.trim().toLowerCase())
  )
  return emails.filter((e) => existing.has(e.trim().toLowerCase()))
}

export const updateUserApplications = (
  id: string,
  applications: Application[]
): User | undefined => {
  const user = findUserById(id)
  if (!user) return undefined
  user.applications = applications
  user.updatedAt = new Date(Date.now()).toISOString()
  persist()
  return user
}

export const updateUserStatus = (
  id: string,
  status: UserStatus
): User | undefined => {
  const user = findUserById(id)
  if (!user) return undefined
  user.status = status
  user.updatedAt = new Date(Date.now()).toISOString()
  persist()
  return user
}

export const addUsers = (users: Partial<User>[]): User[] => {
  const created = users.map((u, idx) => ({
    id: `new_${Date.now()}_${idx}`,
    employeeCode: u.employeeCode || '',
    fullName: u.fullName || '',
    email: u.email || '',
    department: u.department || '',
    title: u.title || '',
    status: (u.status as UserStatus) || 'Active',
    applications:
      u.applications || [
        { id: 'E-Office', name: 'E-Office', enabled: false },
        { id: 'PPC Tool', name: 'PPC Tool', enabled: false },
        { id: 'HRHire', name: 'HRHire', enabled: false },
      ],
    createdAt: new Date(Date.now()).toISOString(),
    updatedAt: new Date(Date.now()).toISOString(),
  })) as User[]
  mockUsers.unshift(...created)
  persist()
  return created
}

import { NextRequest, NextResponse } from 'next/server'
import { MOCK_API_DELAY } from '@/constants'
import { mockUsers } from '@/lib/mockDb'

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY))

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')?.toLowerCase() || ''
  const department = searchParams.get('department') || ''
  const status = searchParams.get('status') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  let filtered = mockUsers.filter((user) => {
    const matchSearch =
      !search ||
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.employeeCode.toLowerCase().includes(search)

    const matchDepartment = !department || user.department === department
    const matchStatus = !status || user.status === status

    return matchSearch && matchDepartment && matchStatus
  })

  const total = filtered.length
  const start = (page - 1) * limit
  const paginatedUsers = filtered.slice(start, start + limit)

  return NextResponse.json({
    success: true,
    data: {
      users: paginatedUsers,
      total,
    },
  })
}

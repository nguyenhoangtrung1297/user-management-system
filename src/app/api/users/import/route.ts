import { NextRequest, NextResponse } from 'next/server'
import { MOCK_API_DELAY } from '@/constants'
import { addUsers, findExistingEmails } from '@/lib/mockDb'
import { shouldSimulateError } from '@/lib/mockError'

export async function POST(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY))

  try {
    const { users } = await request.json()

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dữ liệu không hợp lệ',
        },
        { status: 400 }
      )
    }

    // Giả lập lỗi server (chỉ khi bật MOCK_FAIL_RATE) để kiểm tra UI state
    if (shouldSimulateError()) {
      return NextResponse.json(
        { success: false, error: 'Lỗi server khi nhập dữ liệu' },
        { status: 500 }
      )
    }

    // Chặn email đã tồn tại trong hệ thống (ngoài việc client đã chặn trùng trong file)
    const incomingEmails = users
      .map((u: { email?: string }) => u.email)
      .filter((e: unknown): e is string => typeof e === 'string' && e.trim() !== '')
    const duplicates = findExistingEmails(incomingEmails)

    if (duplicates.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Email đã tồn tại trong hệ thống: ${duplicates.join(', ')}`,
        },
        { status: 409 }
      )
    }

    const created = addUsers(users)

    return NextResponse.json({
      success: true,
      data: created,
      message: `Nhập thành công ${created.length} người dùng`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi khi xử lý request',
      },
      { status: 400 }
    )
  }
}

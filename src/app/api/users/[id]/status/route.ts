import { NextRequest, NextResponse } from 'next/server'
import { MOCK_API_DELAY } from '@/constants'
import { updateUserStatus } from '@/lib/mockDb'
import { shouldSimulateError } from '@/lib/mockError'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY))

  try {
    const { status } = await request.json()
    const userId = params.id

    if (!['Active', 'Inactive'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Trạng thái không hợp lệ',
        },
        { status: 400 }
      )
    }

    if (shouldSimulateError()) {
      return NextResponse.json(
        { success: false, error: 'Lỗi server khi cập nhật trạng thái' },
        { status: 500 }
      )
    }

    const user = updateUserStatus(userId, status)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy người dùng',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Cập nhật trạng thái thành công',
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

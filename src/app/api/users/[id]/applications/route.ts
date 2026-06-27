import { NextRequest, NextResponse } from 'next/server'
import { MOCK_API_DELAY } from '@/constants'
import { updateUserApplications } from '@/lib/mockDb'
import { shouldSimulateError } from '@/lib/mockError'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY))

  try {
    const { applications } = await request.json()
    const userId = params.id

    if (!Array.isArray(applications)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dữ liệu quyền ứng dụng không hợp lệ',
        },
        { status: 400 }
      )
    }

    if (shouldSimulateError()) {
      return NextResponse.json(
        { success: false, error: 'Lỗi server khi cập nhật quyền ứng dụng' },
        { status: 500 }
      )
    }

    const user = updateUserApplications(userId, applications)

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
      message: 'Cập nhật quyền ứng dụng thành công',
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

import {
  User,
  UserFilters,
  ImportPayload,
  StatusUpdatePayload,
  ApplicationUpdatePayload,
  ApiResponse,
} from '@/types'

const API_BASE_URL = '/api'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const userAPI = {
  getUsers: async (filters: UserFilters): Promise<ApiResponse<{ users: User[]; total: number }>> => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      search: filters.search,
      department: filters.department,
      status: filters.status,
    })

    const response = await fetch(`${API_BASE_URL}/users?${params}`)
    return response.json()
  },

  importUsers: async (payload: ImportPayload): Promise<ApiResponse<User[]>> => {
    const response = await fetch(`${API_BASE_URL}/users/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.json()
  },

  updateStatus: async (
    userId: string,
    payload: StatusUpdatePayload
  ): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.json()
  },

  updateApplications: async (
    userId: string,
    payload: ApplicationUpdatePayload
  ): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/applications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.json()
  },
}

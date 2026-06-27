/**
 * Giả lập lỗi server cho mock API (đề bài 4.4: "có thể giả lập lỗi để kiểm tra UI state").
 *
 * Tắt mặc định để thao tác thường ngày không bị vướng. Bật bằng biến môi trường:
 *   MOCK_FAIL_RATE=0.3   -> ~30% request trả lỗi 500 (dùng để demo rollback / error state)
 * Giá trị hợp lệ: 0 (tắt) đến 1 (luôn lỗi).
 */
export const shouldSimulateError = (): boolean => {
  const rate = parseFloat(process.env.MOCK_FAIL_RATE || '0')
  if (!Number.isFinite(rate) || rate <= 0) return false
  return Math.random() < Math.min(rate, 1)
}

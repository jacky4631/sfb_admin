import { ElMessage } from 'element-plus'

export const useMessage = () => {
  return {
    success: (message: string) => ElMessage.success(message),
    error: (message: string) => ElMessage.error(message),
    warning: (message: string) => ElMessage.warning(message),
    info: (message: string) => ElMessage.info(message)
  }
}

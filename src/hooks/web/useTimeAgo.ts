import dayjs from 'dayjs'

export const useTimeAgo = () => {
  const timeAgo = (time: string | Date) => {
    const current = dayjs()
    const target = dayjs(time)
    const diff = current.diff(target, 'minute')

    if (diff < 1) return '刚刚'
    if (diff < 60) return `${diff}分钟前`
    if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
    if (diff < 10080) return `${Math.floor(diff / 1440)}天前`
    if (diff < 43200) return `${Math.floor(diff / 10080)}周前`
    if (diff < 525600) return `${Math.floor(diff / 43200)}月前`
    return `${Math.floor(diff / 525600)}年前`
  }

  const formatDate = (time: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(time).format(format)
  }

  return {
    timeAgo,
    formatDate
  }
}

import WebStorageCache from 'web-storage-cache'

export const CACHE_KEY = {
  IS_DARK: 'is_dark',
  SIZE: 'size',
  LOCALE: 'locale'
} as const

type CacheType = 'session' | 'local'

export const useCache = (type: CacheType = 'local') => {
  const wsCache = new WebStorageCache({
    storage: type
  })

  return {
    wsCache,
    CACHE_KEY
  }
}

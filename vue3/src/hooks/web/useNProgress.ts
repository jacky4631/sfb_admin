import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export const useNProgress = () => {
  const start = () => NProgress.start()
  const done = () => NProgress.done()

  return {
    start,
    done
  }
}

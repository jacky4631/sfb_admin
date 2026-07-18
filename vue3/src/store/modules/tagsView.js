import { defineStore } from 'pinia'

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [],
    cachedViews: []
  }),
  actions: {
    addView(view) {
      if (this.visitedViews.some(v => v.path === view.path)) return
      this.visitedViews.push({
        name: view.name,
        path: view.path,
        fullPath: view.fullPath,
        query: view.query ? { ...view.query } : {},
        title: view.meta.title || 'no-name',
        meta: { ...(view.meta || {}) }
      })
      if (!this.cachedViews.includes(view.name) && !(view.meta && view.meta.noCache)) {
        this.cachedViews.push(view.name)
      }
    },
    addAffixView(view) {
      if (this.visitedViews.some(v => v.path === view.path)) return
      this.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta.title || 'no-name',
        meta: view.meta || {}
      })
    },
    updateVisitedView(view) {
      const index = this.visitedViews.findIndex(v => v.path === view.path)
      if (index !== -1) {
        const existing = this.visitedViews[index]
        const newFullPath = view.fullPath || ''
        const newTitle = (view.meta && view.meta.title) || 'no-name'
        if (existing.fullPath === newFullPath && existing.title === newTitle) return
        // Mutate in place to avoid replacing the object reference (prevents recursive re-renders)
        existing.fullPath = newFullPath
        existing.query = view.query ? { ...view.query } : {}
        existing.title = newTitle
      }
    },
    delCachedView(view) {
      return new Promise(resolve => {
        const idx = this.cachedViews.findIndex(v => v === view.name)
        idx !== -1 && this.cachedViews.splice(idx, 1)
        resolve({ cachedViews: [...this.cachedViews] })
      })
    },
    delView(view) {
      return new Promise(resolve => {
        const idx1 = this.visitedViews.findIndex(v => v.path === view.path)
        idx1 !== -1 && this.visitedViews.splice(idx1, 1)
        const idx2 = this.cachedViews.findIndex(v => v === view.name)
        idx2 !== -1 && this.cachedViews.splice(idx2, 1)
        resolve({ visitedViews: [...this.visitedViews], cachedViews: [...this.cachedViews] })
      })
    },
    delOthersViews(view) {
      return new Promise(resolve => {
        this.visitedViews = this.visitedViews.filter(v => v.meta.affix || v.path === view.path)
        const idx = this.cachedViews.findIndex(v => v === view.name)
        if (idx !== -1) {
          this.cachedViews = [this.cachedViews[idx]]
        } else {
          this.cachedViews = []
        }
        resolve({ visitedViews: [...this.visitedViews], cachedViews: [...this.cachedViews] })
      })
    },
    delAllViews() {
      return new Promise(resolve => {
        this.visitedViews = this.visitedViews.filter(tag => tag.meta.affix)
        this.cachedViews = []
        resolve({ visitedViews: [...this.visitedViews], cachedViews: [...this.cachedViews] })
      })
    },
    delAllCachedViews() {
      this.cachedViews = []
    }
  }
})

export default useTagsViewStore

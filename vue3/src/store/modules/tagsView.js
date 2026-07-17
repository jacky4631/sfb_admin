import { defineStore } from 'pinia'

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [],
    cachedViews: []
  }),
  mutations: {
    ADD_VISITED_VIEW: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta.title || 'no-name',
        meta: view.meta || {}
      })
    },
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      if (view.meta && view.meta.noCache) return
      state.cachedViews.push(view.name)
    },
    DEL_VISITED_VIEW: (state, view) => {
      const index = state.visitedViews.findIndex(v => v.path === view.path)
      index !== -1 && state.visitedViews.splice(index, 1)
    },
    DEL_CACHED_VIEW: (state, view) => {
      const index = state.cachedViews.findIndex(v => v === view.name)
      index !== -1 && state.cachedViews.splice(index, 1)
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter(v =>
        v.meta.affix || v.path === view.path
      )
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      const index = state.cachedViews.findIndex(v => v === view.name)
      if (index !== -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1)
      } else {
        state.cachedViews = []
      }
    },
    DEL_ALL_VISITED_VIEWS: (state) => {
      const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
      state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS: (state) => {
      state.cachedViews = []
    },
    UPDATE_VISITED_VIEW: (state, view) => {
      const index = state.visitedViews.findIndex(v => v.path === view.path)
      if (index !== -1) {
        state.visitedViews[index] = { ...state.visitedViews[index], ...view }
      }
    }
  },
  actions: {
    addView(view) {
      if (this.visitedViews.some(v => v.path === view.path)) return
      this.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta.title || 'no-name',
        meta: view.meta || {}
      })
      if (!this.cachedViews.includes(view.name) && !(view.meta && view.meta.noCache)) {
        this.cachedViews.push(view.name)
      }
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
        resolve()
      })
    },
    delAllViews() {
      return new Promise(resolve => {
        this.visitedViews = this.visitedViews.filter(tag => tag.meta.affix)
        this.cachedViews = []
        resolve()
      })
    }
  }
})

export default useTagsViewStore

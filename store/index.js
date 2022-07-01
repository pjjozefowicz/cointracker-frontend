export const state = () => ({
  initialized: false,
})

export const mutations = {
  setInitialized(state, val) {
    state.initialized = val
  },
}

export const actions = {
    setInitialized({commit}, val) {
        commit('setInitialized', val)
    }
}

export const getters = {
  initialized(state) {
    return state.initialized
  },
}

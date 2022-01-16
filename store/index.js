export const state = () => ({
  initialized: false,
})

export const mutations = {
  setInitialized(state, val) {
    state.initialized = val
  },
}

export const actions = {
    setInitialized({commit}) {
        commit('setInitialized', true)
    }
}

export const getters = {
  initialized(state) {
    return state.initialized
  },
}

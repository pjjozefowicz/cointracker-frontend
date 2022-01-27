export const state = () => ({
  portfolios: [],
  selectedPortfolio: {
    portfolio_id: '',
    name: '',
    owner_id: '',
    is_main: false,
    createdAt: '',
    updatedAt: '',
  },
})

export const mutations = {
  setPortfolios(state, portfolios) {
    state.portfolios = portfolios
  },
  addPortfolio(state, portfolio) {
    state.portfolios.push(portfolio)
  },
  removePortfolio(state, portfolio) {
    state.portfolios.splice(state.portfolios.indexOf(portfolio), 1)
  },
  updatePortfolio(state, portfolio) {
    for (let obj of state.portfolios) {
      if (obj.id === portfolio.portfolio_id) {
        obj = { ...portfolio }
        break
      }
    }
  },
  setSelectedPortfolio(state, portfolio) {
    state.selectedPortfolio = { ...portfolio }
  },
  changeMainPortfolio(state, portfolio) {
    const old_main = state.portfolios.find(p => p.is_main)
    old_main = {...old_main, isMain: false}
    const new_main = state.portfolios.find(p => p.portfolio_id === portfolio.portfolio_id)
    new_main = {...new_main, isMain: true}
  }
}

export const actions = {
  setSelectedPortfolio({ commit, dispatch }, portfolio) {
    commit('setSelectedPortfolio', portfolio)
    // setDashboard
  },
  selectMainPortfolio({ dispatch, state }) {
    const main = state.portfolios.find((p) => p.is_main)
    dispatch('setSelectedPortfolio', main)
  },
  async setPortfolios({ commit, rootState, dispatch }) {
    try {
      const response = await this.$axios.get(
        `/account/portfolios-by-owner/${rootState.auth.user.sub}`
      )
      const portfolios = response.data
      commit('setPortfolios', portfolios)
      dispatch('selectMainPortfolio')
    } catch (error) {
      console.error(error)
    }
  },
  async createPortfolio({ commit, rootState, dispatch }, name) {
    try {
      const response = await this.$axios.post(`/account/portfolio`, {
        name,
        owner_id: rootState.auth.user.sub,
        is_main: false,
      })
      commit('addPortfolio', response.data.portfolio)
      dispatch('setSelectedPortfolio', response.data.portfolio)
    } catch (error) {
      console.error(error)
    }
  },
  async deletePortfolio({ commit, dispatch }, portfolio) {
    try {
      await this.$axios.delete(`/account/portfolio/${portfolio.portfolio_id}`)
      commit('removePortfolio', portfolio)
      dispatch('selectMainPortfolio')
    } catch (error) {
      console.error(error)
    }
  },
  async editPortfolio({ commit }, portfolio) {
    try {
      await this.$axios.put(`/account/portfolio/${portfolio.portfolio_id}`, {
        ...portfolio,
      })
      commit('updatePortfolio', portfolio)
      commit('setSelectedPortfolio', portfolio)
    } catch (error) {
      console.error(error)
    }
  },
  async setMainPortfolio({ commit }, portfolio) {
    try {
      await this.$axios.post(`/account/set-main-portfolio/${portfolio.portfolio_id}`)
      commit('changeMainPortfolio', portfolio)
    } catch (error) {
      console.error(error)
    }
  },
}

export const getters = {
  portfolios(state) {
    return state.portfolios
  },
  selectedPortfolio(state) {
    return state.selectedPortfolio
  },
}

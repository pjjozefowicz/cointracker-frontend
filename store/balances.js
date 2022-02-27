import { roundNumber, numberWithCommas, percent_of_total, percent_change, number_after_prc_change } from "~/utils/helpers"

export const state = () => ({
  coins: [],
  balances: []
})

export const mutations = {
  setCoins(state, val) {
    state.coins = val
  },
  setBalances(state, balances) {
    state.balances = balances
  },
  addBalance(state, balance) {
    state.balances.push(balance)
  },
  removeBalance(state, balance) {
    state.balances.splice(state.balances.indexOf(balance), 1)
  },
  updateBalance(state, balance) {
    for (const obj of state.balances) {
      if (obj.balance_id === balance.balance_id) {
        Object.assign(obj, balance)
        break
      }
    }
  },
}

export const actions = {
  async getCoins({ commit }) {
    try {
      const response = await this.$axios.get(
        `assets/coins-short`
      )
      const coins = response.data
      commit('setCoins', coins)
      console.log("coins fetched")
    } catch (error) {
      console.error(error)
    }
  },
  async getBalancesForPortfolio({ commit }, id) {
    try {
      const response = await this.$axios.get(
        `/account/balances-by-portfolio/${id}`
      )
      const balances = response.data
      commit('setBalances', balances)
    } catch (error) {
      console.error(error)
    }
  },
  async addBalanceToPortfolio({ commit, rootState }, coin_id) {
    try {
      const response = await this.$axios.post(`/account/balance`, {
        coin_id,
        portfolio_id: rootState.portfolios.selectedPortfolio.portfolio_id,
      })
      commit('addBalance', response.data)
    } catch (error) {
      console.error(error)
    }
  }
}

export const getters = {
  coins(state) {
    return state.coins
  },
  balances(state, getters) {
    return state.balances.map(b => {
      const total_balance = getters.total_balance
      const current_value = parseFloat(b.balance_amount) * parseFloat(b.coin_current_price)
      return {
        ...b,
        "coin_code": b.coin_code.toUpperCase(),
        "coin_price_change_1h": roundNumber(b.coin_price_change_prc_1h),
        "coin_price_change_24h": roundNumber(b.coin_price_change_prc_24h),
        "coin_price_change_7d": roundNumber(b.coin_price_change_prc_7d),
        "coin_market_cap": numberWithCommas(b.coin_market_cap),
        "coin_sparkline": JSON.parse(b.coin_sparkline),
        "balance_current_value": current_value,
        "balance_prc_of_total": roundNumber(percent_of_total(current_value, total_balance)),
        "balance_pnl": roundNumber(current_value - parseFloat(b.balance_cost)),
        "pnl_prc_change": roundNumber(percent_change(parseFloat(b.balance_cost), current_value))
      }
    })
  },
  total_balance(state) {
    return state.balances.reduce((total, b) => total + (parseFloat(b.balance_amount) * parseFloat(b.coin_current_price)), 0)
  },
  total_pnl(state, getters) {
    const total_balance = getters.total_balance
    const total_cost = state.balances.reduce((total, b) => total + parseFloat(b.balance_cost), 0)
    return {
      "balance_change": roundNumber(total_balance - total_cost),
      "prc_change": roundNumber(percent_change(total_cost, total_balance))
    }
  },
  change_24h(state, getters) {
    const total_balance = getters.total_balance
    const total_balance_24h_ago = state.balances.reduce((total, b) => total + (parseFloat(b.balance_amount) * number_after_prc_change(parseFloat(b.coin_current_price), -parseFloat(b.coin_price_change_prc_24h))), 0)
    console.log(total_balance)
    console.log(total_balance_24h_ago)
    return {
      "balance_change": roundNumber(total_balance - total_balance_24h_ago),
      "prc_change": roundNumber(percent_change(total_balance_24h_ago, total_balance))
    }
  }
}

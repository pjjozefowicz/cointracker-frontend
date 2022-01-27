export const state = () => ({
  balances: [],
  rates: [],
  cryptos: [],
  history: {},
  transactions: [],
  initialized: false,
})

export const mutations = {
  setInitialized(state, val) {
    state.initialized = val
  },
  setBalances(state, balances) {
    balances.forEach((p) => {
      state.balances.push(p)
    })
    console.log(balances)
  },
  addBalance(state, balance) {
    state.balances.push(balance)
  },
  removeBalance(state, balance) {
    state.balances.splice(state.balances.indexOf(balance), 1)
  },
  updateBalance(state, balance) {
    for (let obj of state.balances) {
      if (obj.id === balance.balance_id) {
        obj = { ...balance }
        break
      }
    }
  },
  setRates(state, rates) {
    rates.forEach((p) => {
      state.rates.push(p)
    })
    console.log(rates)
  },
  addRate(state, rate) {
    state.rates.push(rate)
  },
  removeRate(state, rate) {
    state.rates.splice(state.rates.indexOf(rate), 1)
  },
  updateRate(state, rate) {
    for (let obj of state.rates) {
      if (obj.id === rate.coin_name) {
        obj = { ...rate }
        break
      }
    }
  },
  setHistory(state, history) {
    state.history = { ...history }
    console.log(history)
  },
  setCryptos(state, cryptos) {
    cryptos.forEach((p) => {
      state.cryptos.push(p)
    })
    console.log(cryptos)
  },
  setTransactions(state, txs) {
    txs.forEach((t) => {
      state.transactions.push(t)
    })
    console.log(txs)
  },
  addTransaction(state, tx) {
    state.transactions.push(tx)
  },
  removeTransaction(state, tx) {
    state.transaction.splice(state.transactions.indexOf(tx), 1)
  },
  updateTransaction(state, tx) {
    for (let obj of state.transactions) {
      if (obj.id === tx.transaction_id) {
        obj = { ...tx }
        break
      }
    }
  },
}

export const actions = {
  setInitialized({ commit }) {
    commit('setInitialized', true)
  },
  async initDashboard({ commit, dispatch, rootState, state }) {
    try {
      const response = await this.$axios.get(
        `/account/portfolios-by-owner/${rootState.auth.user.sub}`
      )
      const portfolios = response.data
      commit('setInitialized', true)
      commit('setPortfolios', portfolios)
      dispatch('getCryptos')
      dispatch('loadMainPortfolio')
    } catch (error) {
      console.error(error)
    }
  },
  loadMainPortfolio({ commit, dispatch, state }) {
    const portfolios = state.portfolios
    const mainPortfolio = portfolios.find((p) => {
      return p.is_main === true
    })
    commit('setSelectedPortfolio', mainPortfolio)
    dispatch('getBalance', mainPortfolio.portfolio_id)
  },
  async getCryptos({ commit, dispatch }) {
    try {
      const response = await this.$axios.get(`/assets/coins`)
      commit('setCryptos', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async getBalance({ commit, dispatch }, portfolio_id) {
    try {
      const response = await this.$axios.get(
        `/account/balances-by-portfolio/${portfolio_id}`
      )
      commit('setBalances', response.data)
      dispatch(
        'getRateData',
        response.data.map((balance) => balance.coingecko_id)
      )
      dispatch(
        'getHistory',
        response.data.map((balance) => balance.coingecko_id)
      )
    } catch (error) {
      console.error(error)
    }
  },
  async getRateData({ commit }, coins) {
    console.log(coins)
    try {
      const response = await this.$axios.get(`/assets/coininfo?coins=${coins}`)
      commit('setRates', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async getHistory({ commit }, coins) {
    console.log(coins)
    console.log(coins.map((n) => n))
    try {
      const response = await this.$axios.get(`/assets/history?coins=${coins}`)
      commit('setHistory', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async addBalance({ commit, dispatch, state }, obj) {
    console.log(
      `new balance: ${obj.currentName} new name: ${obj.name}, porfliosls: ${state.portfolios}`
    )
    try {
      const portfolios = state.portfolios
      const target = portfolios.find((p) => {
        return p.name === obj.currentName
      })
      await this.$axios.put(`/account/portfolio/${target.portfolio_id}`, {
        name: obj.name,
      })
      commit('removePortfolio', target)
      const updatedPortfolio = { ...target }
      updatedPortfolio.name = obj.name
      commit('addPortfolio', updatedPortfolio)
      commit('setSelectedPortfolio', updatedPortfolio)
    } catch (error) {
      console.error(error)
    }
  },
  async addCryptoToBalance({ commit, dispatch, state }, crypto_name) {
    console.log(crypto_name)
    const crypto = state.cryptos.find((x) => x.name === crypto_name)
    try {
      const response = await this.$axios.post(`/account/balance/`, {
        amount: 0,
        portfolio_id: state.selectedPortfolio.portfolio_id,
        currency_id: crypto.cryptocurrency_id,
      })
      console.log(response.data.balance)
      commit('addBalance', response.data.balance)
    } catch (error) {
      console.error(error)
    }
  },
  async getTransactions({ commit, dispatch, state }, coin_id) {
    try {
      const response = await this.$axios.get(
        `/account/transactions-by-portfolio/${state.selectedPortfolio.portfolio_id}/${coin_id}`
      )
      console.log(response.data)
      commit('setTransactions', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async addTransaction({ commit, dispatch, state }, tx) {
    console.log(tx)
    try {
      const response = await this.$axios.post(`/account/transaction`, {
        rate: tx.rate,
        amount: tx.amount,
        total_spent: tx.total_spent,
        type: tx.type,
        base_id: tx.base_id,
        date: tx.date,
        fee: tx.fee,
        note: tx.note,
        portfolio_id: state.selectedPortfolio.portfolio_id,
      })
      console.log(response.data)
      commit('addTransaction', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async editTransaction({ commit, dispatch, state }, tx) {
    console.log(tx)
    try {
      const response = await this.$axios.put(
        `/account/transaction/${tx.transaction_id}`,
        {
          rate: tx.rate,
          amount: tx.amount,
          total_spent: tx.total_spent,
          type: tx.type,
          base_id: tx.base_id,
          date: tx.date,
          fee: tx.fee,
          note: tx.note,
          portfolio_id: state.selectedPortfolio.portfolio_id,
        }
      )
      console.log(response.data)
      commit('editTransaction', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async deleteTransaction({ commit, dispatch, state }, tx_id) {
    console.log(tx_id)
    try {
      const response = await this.$axios.delete(`/account/transaction/${tx_id}`)
      console.log(response.data)
      commit('deleteTransaction', response.data)
    } catch (error) {
      console.error(error)
    }
  },
}

export const getters = {
  portfolios(state) {
    return state.portfolios
  },
  balances(state) {
    return state.balances
  },
  tableData(state) {
    // if (
    //   (state.balances !== undefined && state.balances !== 0) &&
    //   (state.rates !== undefined && state.rates !== 0)
    // ) {
    const tableData = []
    state.balances.forEach((b) => {
      const rate = state.rates.find((x) => x.coin_name === b.coingecko_id)
      if (rate) {
        tableData.push({
          cryptocurrency_id: b.cryptocurrency_id,
          coingecko_id: b.coingecko_id,
          name: b.name,
          price: roundNumber(rate.pln),
          '1h': roundNumber(rate.pln_1h),
          '24h': roundNumber(rate.pln_1d),
          '7d': roundNumber(rate.pln_7d),
          market_cap: roundNumber(rate.market_cap),
          holdings: b.amount,
          pnl: 'pnl',
        })
      }
    })
    return tableData
    // }
  },
  initialized(state) {
    return state.initialized
  },
  selectedPortfolio(state) {
    return state.selectedPortfolio
  },
  selectCoins(state) {
    const balances = state.balances.map((b) => b.coingecko_id)
    const cryptos = state.cryptos.map((b) => b.coingecko_id)
    let res = cryptos.filter((item) => !balances.includes(item))
    res = state.cryptos.map((b) => b.name)
    return res
  },
  transactions(state) {
    return state.transactions
  },
}

function roundNumber(num) {
  num = parseFloat(num)
  // return num.toFixed(2)
  return Math.round((num + Number.EPSILON) * 100) / 100
}

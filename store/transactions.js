export const state = () => ({
    transactions: [],
    balance: {}
})

export const mutations = {
    setBalance(state, balance) {
        state.balance = balance
    },
    setTransactions(state, txs) {
        state.transactions = txs
    },
    addTransaction(state, tx) {
        state.transactions.push(tx)
    },
    removeTransaction(state, tx) {
        state.transactions.splice(state.transactions.indexOf(tx), 1)
    },
    updateTransaction(state, tx) {
        for (const obj of state.transactions) {
            if (obj.tx_id === tx.tx_id) {
                Object.assign(obj, tx)
                break
            }
        }
    },
}

export const actions = {
    initTransactionsForBalance({ commit, dispatch, rootState }, balance_id) {
        dispatch("getTransactionsByBalance", balance_id)
        const balance = rootState.balances.balances.find(x => x.balance_id === balance_id)
        commit("setBalance", balance)
    },
    async getTransactionsByBalance({ commit }, id) {
        try {
            const response = await this.$axios.get(
                `/account/transactions-by-balance/${id}`
            )
            const transactions = response.data
            commit('setTransactions', transactions)
        } catch (error) {
            console.error(error)
        }
    },
    async addToPortfolio({ commit, rootState }, coin_id) {
        try {
            const response = await this.$axios.post(`/account/tx`, {
                coin_id,
                portfolio_id: rootState.portfolios.selectedPortfolio.portfolio_id,
            })
            commit('addtx', response.data)
        } catch (error) {
            console.error(error)
        }
    }
}

export const getters = {
    coins(state) {
        return state.coins
    },
    transactions(state, getters) {
        return state.transactions.map(b => {
            const total_tx = getters.total_tx
            const current_value = parseFloat(b.tx_amount) * parseFloat(b.coin_current_price)
            return {
                ...b,
                "coin_code": b.coin_code.toUpperCase(),
                "coin_price_change_1h": roundNumber(b.coin_price_change_1h),
                "coin_price_change_24h": roundNumber(b.coin_price_change_24h),
                "coin_price_change_7d": roundNumber(b.coin_price_change_7d),
                "coin_market_cap": numberWithCommas(b.coin_market_cap),
                "coin_sparkline": JSON.parse(b.coin_sparkline),
                "tx_current_value": current_value,
                "tx_prc_of_total": percent_of_total(current_value, total_tx),
                "tx_pnl": current_value - parseFloat(b.tx_cost),
                "pnl_prc_change": percent_change(parseFloat(b.tx_cost), current_value)
            }
        })
    },
    total_tx(state) {
        return state.transactions.reduce((total, b) => total + (parseFloat(b.tx_amount) * parseFloat(b.coin_current_price)), 0)
    },
    total_pnl(state, getters) {
        const total_tx = getters.total_tx
        const total_cost = state.transactions.reduce((total, b) => total + parseFloat(b.tx_cost), 0)
        return {
            "tx_change": total_tx - total_cost,
            "prc_change": percent_change(total_cost, total_tx)
        }
    },
    change_24h(state, getters) {
        const total_tx = getters.total_tx
        const total_tx_24h_ago = state.transactions.reduce((total, b) => total + (parseFloat(b.tx_amount) * number_after_prc_change(parseFloat(b.coin_current_price), -parseFloat(b.coin_price_change_24h))), 0)
        return {
            "tx_change": total_tx - total_tx_24h_ago,
            "prc_change": percent_change(total_tx_24h_ago, total_tx)
        }
    },
    balance(state) {
        const b = state.balance
        const current_value = parseFloat(b.balance_amount) * parseFloat(b.coin_current_price)
        return {
            ...state.balance,
            "coin_code": b.coin_code.toUpperCase(),
            "coin_price_change_1h": roundNumber(b.coin_price_change_1h),
            "coin_price_change_24h": roundNumber(b.coin_price_change_24h),
            "coin_price_change_7d": roundNumber(b.coin_price_change_7d),
            "coin_market_cap": numberWithCommas(b.coin_market_cap),
            "coin_sparkline": JSON.parse(b.coin_sparkline),
            "balance_current_value": current_value,
            "balance_pnl": current_value - parseFloat(b.balance_cost),
            "pnl_prc_change": percent_change(parseFloat(b.balance_cost), current_value)
        }
    }
}

function roundNumber(num) {
    num = parseFloat(num)
    return Math.round((num + Number.EPSILON) * 100) / 100
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function percent_of_total(num, total) {
    return num / total * 100
}

function percent_change(from, to) {
    return (to - from) / from * 100
}

function number_after_prc_change(number, prc_change) {
    return ((prc_change / 100) * number) + number
}
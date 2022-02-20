export const state = () => ({
    transactions: [],
    balance: {},
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
    updateTxForm(state, val) {
        console.log("Updating txForm")
        console.log(val)
        state.txForm = val
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
    async addTransaction({ commit }, tx) {
        console.log(tx)
        try {
            const response = await this.$axios.post(`account/transaction`, {
                ...tx
            })
            console.log(response.data)
            commit('addTransaction', response.data.transaction)
            commit("balances/updateBalance", response.data.balance, { root: true })
            commit("setBalance", response.data.balance)
        } catch (error) {
            console.error(error)
        }
    },
    async deleteTransaction({ commit }, tx) {
        try {
            const response = await this.$axios.delete(`account/transaction/${tx.transaction_id}`,)
            commit('removeTransaction', response.data.transaction)
            commit("balances/updateBalance", response.data.balance, { root: true })
            commit("setBalance", response.data.balance)
        } catch (error) {
            console.error(error)
        }
    },
    async updateTransaction({ commit }, tx) {
        console.log(tx)
        try {
            const response = await this.$axios.put(`account/transaction/${tx.transaction_id}`, {
                ...tx
            })
            console.log(response.data)
            commit('updateTransaction', response.data.transaction)
            commit("balances/updateBalance", response.data.balance, { root: true })
            commit("setBalance", response.data.balance)
        } catch (error) {
            console.error(error)
        }
    },
}

export const getters = {
    transactions(state) {
        return state.transactions.map((t) => {
            return {
                ...t,
                note: t.note == null ? '-' : t.note,
                pnl: roundNumber(percent_change(parseFloat(t.total_spent), parseFloat(t.amount) * parseFloat(state.balance.coin_current_price))),
                type: capitalizeFirstLetter(t.type),
                rate: roundNumber(t.rate),
                total_spent: roundNumber(t.total_spent)
            }
        })
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
            "balance_current_value": roundNumber(current_value),
            "balance_pnl": roundNumber(current_value - parseFloat(b.balance_cost)),
            "pnl_prc_change": roundNumber(percent_change(parseFloat(b.balance_cost), current_value)),
            "balance_cost": roundNumber(parseFloat(b.balance_cost))
        }
    },
}

function roundNumber(num) {
    num = parseFloat(num)
    return Math.round((num + Number.EPSILON) * 100) / 100
}

// function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
// }

// function percent_of_total(num, total) {
//     return num / total * 100
// }

function percent_change(from, to) {
    return (to - from) / from * 100
}

function number_after_prc_change(number, prc_change) {
    return ((prc_change / 100) * number) + number
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
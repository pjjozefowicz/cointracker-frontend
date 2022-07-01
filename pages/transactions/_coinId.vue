<template>
  <div v-if="balance">
    <v-row justify="start" align="center">
      <v-col>
        <v-card class="mx-auto" outlined>
          <v-card-title>
            <v-avatar size="36">
              <v-img :src="balance.coin_image_url"></v-img>
            </v-avatar>
            <p class="ml-3 mb-0">{{ balance.coin_name }}</p>
            <p class="ml-3 mb-0 grey--text">{{ balance.coin_code }}</p>
            <div class="ml-4">
              {{ `${balance.coin_current_price} ${currency}` }}
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="start" align="center">
      <v-col cols="12" xs="12" sm="6" lg="3" xl="2">
        <v-card class="mx-auto" outlined>
          <v-card-title>{{
            `${balance.balance_current_value} ${currency}`
          }}</v-card-title>
          <v-card-text>
            <div>Holdings Value</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="6" lg="3" xl="2">
        <v-card class="mx-auto" outlined>
          <v-card-title>{{
            `${balance.balance_amount} ${balance.coin_code}`
          }}</v-card-title>
          <v-card-text>
            <div>Holdings</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="6" lg="3" xl="2">
        <v-card class="mx-auto" outlined>
          <v-card-title>{{
            `${balance.balance_cost} ${currency}`
          }}</v-card-title>
          <v-card-text>
            <div>Total Cost</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="6" lg="3" xl="2">
        <v-card class="mx-auto" outlined>
          <v-card-title>{{
            `${balance.balance_pnl} ${currency}`
          }}</v-card-title>
          <v-card-text>
            <div>
              Profit / Loss<span
                :class="
                  balance.pnl_prc_change < 0 ? 'red--text' : 'green--text'
                "
                >{{ ` ${balance.pnl_prc_change}%` }}</span
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <TransactionsTable />
      </v-col>
    </v-row>
  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TransactionsPage',
  data: () => ({
    currency: 'PLN',
  }),
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters('transactions', ['balance']),
    ...mapGetters(['initialized']),
  },
  methods: {
    ...mapActions('balances', ['checkIfBalanceExists']),
    ...mapActions('transactions', ['initTransactionsForBalance']),
  },
  async beforeMount() {
    const exists = await this.checkIfBalanceExists(this.$route.params.coinId)
    if (!this.initialized) {
      this.$router.push("/");
    } else if (!exists) {
      this.$router.push("/error");
    } else {
      this.initTransactionsForBalance(this.$route.params.coinId)
    }
  },
}
</script>

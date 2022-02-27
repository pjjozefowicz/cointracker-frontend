<template>
  <div>
    <v-row justify="start" align="center">
      <v-col cols="2">
        <v-card class="mx-auto" color="primary">
          <v-card-title>{{ total_balance + ' ' + currency }}</v-card-title>
          <v-card-text>
            <div>Total Balance</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="primary">
          <v-card-title>{{
            `${change_24h.balance_change} ${currency}`
          }}</v-card-title>
          <v-card-text>
            <div>
              24h Portfolio Change
              <span
                :class="change_24h.prc_change < 0 ? 'red--text' : 'green--text'"
                >{{ change_24h.prc_change }}%</span
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="primary">
          <v-card-title>{{
            `${total_pnl.balance_change} ${currency}`
          }}</v-card-title>
          <v-card-text>
            <div>
              Total Profit Loss
              <span
                :class="total_pnl.prc_change < 0 ? 'red--text' : 'green--text'"
                >{{ `${total_pnl.prc_change}%` }}</span
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
      <portfolio-menu />
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <DashboardTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPage',
  data: () => ({
    currency: 'PLN',
  }),
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters('balances', ['total_balance', 'total_pnl', 'change_24h']),
  },
}
</script>

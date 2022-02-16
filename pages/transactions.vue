<template>
  <div>
    <v-row justify="start" align="center">
      <v-col>
        <v-card class="mx-auto" color="purple">
          <v-card-title>
            <v-avatar size="36">
              <v-img :src="balance.coin_image_url"></v-img>
            </v-avatar>
            <p class="ml-3 mb-0">{{ balance.coin_name }}</p>
            <p class="ml-3 mb-0 grey--text">{{ balance.coin_code }}</p>
            <div class="ml-4">{{ `${balance.coin_current_price} ${currency}` }}</div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="start" align="center">
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>{{ `${balance.balance_current_value} ${currency}` }}</v-card-title>
          <v-card-text>
            <div>Holdings Value</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>{{ `${balance.balance_amount} ${balance.coin_code}` }}</v-card-title>
          <v-card-text>
            <div>Holdings</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>{{ `${balance.balance_cost} ${currency}` }}</v-card-title>
          <v-card-text>
            <div>Total Cost</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>{{ `${balance.balance_pnl} ${currency} ${balance.pnl_prc_change}%` }}</v-card-title>
          <v-card-text>
            <div>Profit / Loss</div>
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
import { mapGetters } from 'vuex'
export default {
  name: 'TransactionsPage',
  data: () => ({
    currency: 'PLN',
  }),
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters('transactions', ['balance']),
  },
}
</script>

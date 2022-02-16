<template>
  <v-data-table
    :headers="headers"
    :items="balances"
    sort-by="calories"
    class="elevation-1"
    @click:row="handleClick"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Your portfolio</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <add-coin></add-coin>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="null">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="null">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.coin_current_price`]="{ item }">
      <td>
        {{ item.coin_current_price + ' ' + currency }}
      </td>
    </template>
    <template #[`item.coin_price_change_1h`]="{ item }">
      <td :class="item.coin_price_change_1h < 0 ? 'red--text' : 'green--text'">
        {{ item.coin_price_change_1h }}%
      </td>
    </template>
    <template #[`item.coin_price_change_24h`]="{ item }">
      <td :class="item.coin_price_change_24h < 0 ? 'red--text' : 'green--text'">
        {{ item.coin_price_change_24h }}%
      </td>
    </template>
    <template #[`item.coin_price_change_7d`]="{ item }">
      <td :class="item.coin_price_change_7d < 0 ? 'red--text' : 'green--text'">
        {{ item.coin_price_change_7d }}%
      </td>
    </template>
    <template #[`item.coin_market_cap`]="{ item }">
      <td>
        {{ item.coin_market_cap + ' ' + currency }}
      </td>
    </template>
    <template #[`item.holdings`]="{ item }">
      <td>
        <div class="d-flex flex-column">
          <p>
            {{
              `${item.balance_current_value} ${currency} (${item.balance_prc_of_total})%`
            }}
          </p>
          <p>{{ item.balance_amount + ' ' + item.coin_code }}</p>
        </div>
      </td>
    </template>
    <template #[`item.pnl`]="{ item }">
      <td>
        <div class="d-flex flex-column">
          <p>{{ `${item.balance_pnl} ${currency}` }}</p>
          <p :class="item.pnl_prc_change < 0 ? 'red--text' : 'green--text'">
            {{ item.pnl_prc_change + '%' }}
          </p>
        </div>
      </td>
    </template>
    <template #[`item.coin_name`]="{ item }">
      <div class="d-flex align-center">
        <v-avatar size="36">
          <v-img :src="item.coin_image_url"></v-img>
        </v-avatar>
        <p class="ml-3 mb-0">{{ item.coin_name }}</p>
        <p class="ml-3 mb-0 grey--text">{{ item.coin_code }}</p>
      </div>
    </template>
    <template #[`item.coin_sparkline`]="{ item }">
      <Sparkline height="100%" :data="item.coin_sparkline" />
    </template>
    <template #[`item.actions`]="{}">
      <v-icon small class="mr-2"> mdi-plus-box </v-icon>
      <v-icon small class="mr-2"> mdi-format-list-bulleted-square </v-icon>
    </template>
    <template #no-data>
      <v-btn color="primary"> There ain't no data </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    addBalanceDialog: false,
    dialogDelete: false,
    newCoin: '',
    currency: 'PLN',
    headers: [
      {
        text: 'Coin',
        align: 'start',
        sortable: false,
        value: 'coin_name',
      },
      { text: 'Price', value: 'coin_current_price' },
      { text: '1h', value: 'coin_price_change_1h' },
      { text: '24h', value: 'coin_price_change_24h' },
      { text: '7d', value: 'coin_price_change_7d' },
      { text: 'Market cap', value: 'coin_market_cap' },
      { text: 'Last 7 days', value: 'coin_sparkline' },
      { text: 'Holdings', value: 'holdings' },
      { text: 'PNL', value: 'pnl' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),

  methods: {
    ...mapActions('transactions', ['initTransactionsForBalance']),

    handleClick(value) {

      this.initTransactionsForBalance(value.balance_id).finally((_) =>
        this.$router.push({
          path: `/transactions/`,
        })
      )
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    // mix the getters into computed with object spread operator
    ...mapGetters('balances', ['balances']),
  },
}
</script>
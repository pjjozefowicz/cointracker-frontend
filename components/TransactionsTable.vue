<template>
  <v-data-table
    :headers="headers"
    :items="transactions"
    sort-by="calories"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Your transactions</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <tx-create-dialog/>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <tx-edit-dialog :tx="{...item}"/>
      <tx-delete-dialog :tx="item"/>
    </template>
    <template #no-data>
      <v-card> No transactions yet </v-card>
    </template>
    <template #[`item.date`]="{ item }">
      <td>{{ new Date(item.date).toLocaleString('pl-PL') }}</td>
    </template>
    <template #[`item.type`]="{ item }">
      <td :class="item.type === 'Buy' ? 'green--text' : 'red--text'">
        {{ item.type }}
      </td>
    </template>
    <template #[`item.pnl`]="{ item }">
      <td :class="item.pnl < 0 ? 'red--text': 'green--text'">
        {{ `${item.pnl}%` }}
      </td>
    </template>
    <template #[`item.rate`]="{ item }">
      <td>
        {{ `${item.rate} ${currency}` }}
      </td>
    </template>
     <template #[`item.amount`]="{ item }">
      <td :class="item.type === 'Buy' ? 'green--text' : 'red--text'">
        {{ `${item.type === 'Buy' ? '+' : '-'} ${item.amount}` }}
      </td>
    </template>
     <template #[`item.total_spent`]="{ item }">
      <td>
        {{ `${item.total_spent} ${currency}` }}
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    headers: [
      { text: 'Type', value: 'type' },
      { text: 'Price', value: 'rate' },
      { text: 'Quantity', value: 'amount' },
      { text: 'Date', value: 'date' },
      { text: 'Fees', value: 'fee' },
      { text: 'Cost', value: 'total_spent' },
      { text: 'PNL', value: 'pnl' },
      { text: 'Notes', value: 'note' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    currency: 'PLN',
    dialogDelete: false,
  }),

  computed: {
    ...mapGetters('transactions', ['transactions']),
  }
}
</script>
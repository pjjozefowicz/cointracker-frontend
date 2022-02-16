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
        <transaction-dialog :edit="false"/>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-delete </v-icon>
      <!-- <v-icon small  @click="deleteItem(item)"> mdi-delete </v-icon> -->
    </template>
    <template #no-data>
      <v-btn color="primary"> No transactions yet </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TransactionDialog from './TransactionDialog.vue'
export default {
  components: { TransactionDialog },
  data: () => ({
    headers: [
      { text: 'Type', value: 'type' },
      { text: 'Price', value: 'rate' },
      { text: 'Quantity', value: 'amount' },
      { text: 'Date', value: 'date' },
      { text: 'Fees', value: 'fee' },
      { text: 'Cost', value: 'cost' },
      { text: 'PNL', value: 'pnl' },
      { text: 'Notes', value: 'note' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    dialogDelete: false
  }),

  computed: {
    ...mapGetters('dashboard', ['transactions']),
  },

  methods: {
    ...mapActions()
  },
}
</script>
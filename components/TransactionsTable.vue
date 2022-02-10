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
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.7d_chart`]="{}">
      <Sparkline height="100%" />
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-delete </v-icon>
      <!-- <v-icon small  @click="deleteItem(item)"> mdi-delete </v-icon> -->
    </template>
    <template #no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TransactionDialog from './TransactionDialog.vue'
export default {
  components: { TransactionDialog },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Coin',
        align: 'start',
        sortable: false,
        value: 'name',
      },
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
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    // mix the getters into computed with object spread operator
    ...mapGetters('dashboard', ['transactions']),
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.desserts = []
    },

    ...mapActions('dashboard', [
      'setPortfolio',
      'createPortfolio',
      'deletePortfolio',
      'editPortfolio',
      'addCryptoToBalance',
      'getTransactions'
    ]),

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
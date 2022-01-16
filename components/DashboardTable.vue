<template>
  <v-data-table
    :headers="headers"
    :items="tableData"
    sort-by="calories"
    class="elevation-1"
    @click:row="handleClick"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Your portfolio</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="addBalanceDialog" max-width="500px">
          <template #activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Add new coin
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add new coin</span>
            </v-card-title>

            <v-card-text>
              <v-select
                v-model="newCoin"
                :items="selectCoins"
                label="coins"
              ></v-select>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeAddBalance">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveAddBalance">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-plus-box </v-icon>
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-format-list-bulleted-square
      </v-icon>
      <!-- <v-icon small  @click="deleteItem(item)"> mdi-delete </v-icon> -->
    </template>
    <template #no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
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
    headers: [
      {
        text: 'Coin',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Price', value: 'price' },
      { text: '1h', value: '1h' },
      { text: '24h', value: '24h' },
      { text: '7d', value: '7d' },
      { text: 'Market cap', value: 'market_cap' },
      { text: 'Last 7 days', value: '7d_chart' },
      { text: 'Holdings', value: 'holdings' },
      { text: 'PNL', value: 'pnl' },
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
    ...mapActions('dashboard', [
      'setPortfolio',
      'createPortfolio',
      'deletePortfolio',
      'editPortfolio',
      'addCryptoToBalance',
      'getTransactions'
    ]),

    handleClick(value) {
      this.getTransactions(value.cryptocurrency_id)
      this.$router.push({
        path: `/transactions/`,
      })
    },

    initialize() {
      this.desserts = []
    },

    closeAddBalance() {
      this.addBalanceDialog = false
    },
    saveAddBalance() {
      this.addCryptoToBalance(this.newCoin)
      this.addBalanceDialog = false
    },

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
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    // mix the getters into computed with object spread operator
    ...mapGetters('dashboard', ['tableData', 'selectCoins']),
  },
}
</script>
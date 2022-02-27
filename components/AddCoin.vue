<template>
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
        <v-autocomplete
          v-model="selectedCoin"
          :items="coins"
          :loading="isLoading"
          :search-input.sync="search"
          clearable
          hide-details
          hide-selected
          item-text="name"
          item-value="code"
          full-width
          label="Search for a coin..."
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                Search for your favorite
                <strong>Cryptocurrency</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:selection="{ item }">
            <v-list-item-avatar>
              <v-img :src="item.image_url"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.code"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <template v-slot:item="{ item }">
            <v-list-item-avatar>
              <v-img :src="item.image_url"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.code"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeAddBalance">
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="saveAddBalance"
          :disabled="selectedCoin == null"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    selectedCoin: null,
    isLoading: false,
    search: null,
    addBalanceDialog: false,
  }),

  watch: {
    addBalanceDialog(val) {
      if (!val) {
        this.selectedCoin = null
      }
    },

    search(_) {
      // Items have already been loaded
      if (this.coins.length > 0) return
      this.isLoading = true
      this.getCoins().finally(() => (this.isLoading = false))
    },
  },
  methods: {
    ...mapActions('balances', ['getCoins', 'addBalanceToPortfolio']),

    closeAddBalance() {
      this.selectedCoin = null
      this.addBalanceDialog = false
    },
    saveAddBalance() {
      console.log(this.selectedCoin)
      this.addBalanceToPortfolio(this.selectedCoin.coin_id)
      this.addBalanceDialog = false
    },
  },
  computed: {
    ...mapGetters('balances', ['coins']),
  },
}
</script>
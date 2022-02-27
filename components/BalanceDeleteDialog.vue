<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on }">
      <v-btn icon><v-icon small v-on="on"> mdi-delete </v-icon></v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center"
        >Are you sure you want to delete this balance and all related
        transactions?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="deleteBalanceItem">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    balance: Object,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    deleteBalanceItem() {
      this.deleteBalance(this.balance)
      this.closeDialog()
    },
    closeDialog() {
      this.dialog = false
    },
    ...mapActions('balances', ['deleteBalance']),
  },
}
</script>


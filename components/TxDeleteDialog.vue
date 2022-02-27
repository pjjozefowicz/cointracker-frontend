<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on }">
      <v-icon small class="mr-2" v-on="on"> mdi-delete </v-icon>
    </template>
    <v-card>
      <v-card-title class="justify-center"
        >Are you sure you want to delete this transaction?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="deleteTx"
          >OK</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    tx: Object,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    deleteTx() {
        this.deleteTransaction(this.tx)
        this.closeDialog()
    },
    closeDialog() {
        this.dialog = false
    },
    ...mapActions('transactions', ['deleteTransaction']),
  },
}
</script>


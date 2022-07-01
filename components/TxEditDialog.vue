<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on }">
      <v-icon small class="mr-2" v-on="on"> mdi-pencil </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{
          `Edit ${tx.type.toLowerCase()} transaction`
        }}</span>
      </v-card-title>
      <tx-form edit :buy="tx.type.toLowerCase() === 'buy'" :passedTx="tx" @close-dialog="dialog = false"></tx-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    tx: Object,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {},
}
</script>


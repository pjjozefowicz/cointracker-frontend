<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="primary">Add transaction</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add transaction</span>
      </v-card-title>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab>Buy</v-tab>
        <v-tab>Sell</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <tx-form buy @close-dialog="dialog = false"></tx-form>
        </v-tab-item>
        <v-tab-item>
          <tx-form @close-dialog="dialog = false"></tx-form>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    tab: null,
    dialog: false,
  }),
  methods: {},
}
</script>


<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
        {{ title }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ title }}</span>
      </v-card-title>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab>Buy</v-tab>
        <v-tab>Sell</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <transaction-content></transaction-content>
        </v-tab-item>
        <v-tab-item>
          <transaction-content></transaction-content>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    edit: Boolean,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    tab: null,
    tx: {
      rate: 0,
      amount: 0,
      total_spent: 0,
      type: '',
      date: '',
      fee: 0,
    },
  }),
  computed: {
    title() {
      return this.edit ? 'Edit transacion' : 'Add transaction'
    },
  },
  methods: {
    close() {
      this.dialog = false
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


<template>
  <div class="pa-1">
    <v-card-text>
      <div class="d-flex justify-end">
        <v-btn small text @click="total_spent_change"
          ><v-icon left>mdi-arrow-left-right</v-icon> {{ option_label }}
        </v-btn>
      </div>
      <v-text-field
        outlined
        v-if="total_spent"
        disabled
        v-model="rate_computed"
        label="Price per coin"
        suffix="PLN"
      ></v-text-field>
      <v-text-field
        v-else
        outlined
        v-model="tx.rate"
        label="Price per coin"
        suffix="PLN"
      ></v-text-field>

      <v-text-field
        outlined
        v-model="tx.amount"
        label="Amount"
        :suffix="balance.coin_code"
      >
      </v-text-field>

      <v-text-field
        v-if="total_spent"
        outlined
        v-model="tx.total_spent"
        label="Total spent"
        suffix="PLN"
      ></v-text-field>
      <v-text-field
        v-else
        outlined
        disabled
        v-model="total_spent_computed"
        label="Total spent"
        suffix="PLN"
      ></v-text-field>

      <v-menu
        v-model="dateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            outlined
            v-model="picker"
            label="Date"
            prepend-inner-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          no-title
          v-model="picker"
          @input="dateMenu = false"
        ></v-date-picker>
      </v-menu>
      <v-expand-transition>
        <div class="" v-show="expand">
          <v-text-field
            outlined
            v-model="tx.fee"
            label="Fees"
            suffix="PLN"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="tx.notes"
            label="Notes"
          ></v-text-field>
        </div>
      </v-expand-transition>
      <v-btn class="" color="primary" x-small text @click="expand = !expand">
        Fees and notes (optional)
        <v-icon right>{{ expand ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
      <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    edit: Boolean,
  },
  data: () => ({
    expand: false,
    dateMenu: false,
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    total_spent: false,
    dialog: false,
    dialogDelete: false,
    tx: {
      rate: 0,
      amount: 1,
      total_spent: 0,
      type: '',
      date: '',
      fee: 0,
      notes: '',
    },
  }),
  computed: {
    title() {
      return this.edit ? 'Edit transacion' : 'Add transaction'
    },
    option_label() {
      return this.total_spent ? 'Price per coin' : 'Total spent'
    },
    rate_computed() {
      return this.tx.total_spent / this.tx.amount
    },
    total_spent_computed() {
      return this.tx.rate * this.tx.amount
    },
    ...mapGetters('transactions', ['balance']),
  },
  methods: {
    total_spent_change() {
      if (this.total_spent) {
        this.tx.rate = this.rate_computed
      } else {
        this.tx.total_spent = this.total_spent_computed
      }
      this.total_spent = !this.total_spent
    },

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
    ...mapActions(),
  },
}
</script>
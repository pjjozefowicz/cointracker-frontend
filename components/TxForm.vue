<template>
  <div class="pa-1">
    <v-card-text>
      <v-form v-model="valid">
        <div class="d-flex justify-end">
          <v-btn small text @click="total_spent_change" class="mb-2"
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
          :rules="numberRules"
          type="number"
          hide-spin-buttons
        ></v-text-field>

        <v-text-field
          outlined
          v-model="tx.amount"
          label="Amount"
          :suffix="balance.coin_code"
          :rules="numberRules"
          type="number"
          hide-spin-buttons
        >
        </v-text-field>

        <v-text-field
          v-if="total_spent"
          outlined
          v-model="tx.total_spent"
          label="Total spent"
          suffix="PLN"
          :rules="numberRules"
          type="number"
          hide-spin-buttons
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
          v-model="dateTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              outlined
              v-model="formattedDate"
              label="Date"
              prepend-inner-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              readonly
              :rules="dateRules"
            ></v-text-field>
          </template>
          <v-card>
            <v-card-title class="justify-center">{{
              formattedDate
            }}</v-card-title>
            <v-tabs v-model="tab" fixed-tabs>
              <v-tab>Date</v-tab>
              <v-tab>Time</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-date-picker
                  no-title
                  v-model="date"
                  @input="tab = 1"
                ></v-date-picker>
              </v-tab-item>
              <v-tab-item>
                <v-time-picker
                  v-if="dateTimeMenu"
                  no-title
                  format="24hr"
                  v-model="time"
                ></v-time-picker>
              </v-tab-item>
            </v-tabs-items>
            <v-card-actions class="justify-end">
              <v-btn @click="dateTimeMenu = false">Cancel</v-btn>
              <v-btn @click="dateTimeMenu = false">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-expand-transition>
          <div class="" v-show="expand">
            <v-text-field
              outlined
              v-model="tx.fee"
              label="Fees"
              suffix="PLN"
              :rules="feeRules"
              type="number"
              hide-spin-buttons
            ></v-text-field>
            <v-text-field
              outlined
              v-model="tx.note"
              label="Notes"
              :rules="noteRules"
            ></v-text-field>
          </div>
        </v-expand-transition>
        <v-btn class="" color="primary" x-small text @click="expand = !expand">
          Fees and notes (optional)
          <v-icon right>{{
            expand ? 'mdi-chevron-up' : 'mdi-chevron-down'
          }}</v-icon>
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
      <v-btn color="blue darken-1" text @click="save" :disabled="!valid">
        Save
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    buy: Boolean,
    edit: Boolean,
    passedTx: Object,
  },
  data: () => ({
    valid: true,
    expand: false,
    dateTimeMenu: false,
    total_spent: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    time: new Date(Date.now()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    tab: null,
    tx: {
      rate: 0,
      amount: 1,
      total_spent: 0,
      type: '',
      fee: 0,
      note: '',
    },
    default_tx: {
      rate: 0,
      amount: 1,
      total_spent: 0,
      type: '',
      fee: 0,
      note: '',
    },
    numberRules: [(v) => !!v || 'This field is required'],
    feeRules: [(v) => !!v || 'Invalid input'],
    dateRules: [(v) => !!v || 'This field is required'],
    noteRules: [(v) => v.length <= 256 || 'Note can have 256 characters max'],
  }),
  computed: {
    option_label() {
      return this.total_spent ? 'Price per coin' : 'Total spent'
    },
    rate_computed() {
      return this.tx.total_spent / this.tx.amount
    },
    total_spent_computed() {
      return this.tx.rate * this.tx.amount
    },
    formattedDate() {
      return `${this.formatDate(this.date)} ${this.time}`
    },
    ...mapGetters('transactions', ['balance']),
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    total_spent_change() {
      if (this.total_spent) {
        this.tx.rate = this.rate_computed
      } else {
        this.tx.total_spent = this.total_spent_computed
      }
      this.total_spent = !this.total_spent
    },
    closeDialog() {
      this.$emit('close-dialog')
      if (!this.edit) {
        this.$nextTick(() => {
          this.tx = Object.assign({}, this.default_tx)
        })
      }
    },
    cancel() {
      this.closeDialog()
    },
    save() {
      if (this.edit) {
        this.saveEdit()
      } else {
        this.saveCreate()
      }
      this.closeDialog()
    },
    saveCreate() {
      this.addTransaction({
        ...this.tx,
        balance_id: this.balance.balance_id,
        type: this.buy ? 'buy' : 'sell',
        total_spent: this.total_spent
          ? this.tx.total_spent
          : this.total_spent_computed,
        rate: this.total_spent ? this.rate_computed : this.tx.rate,
        date: new Date(`${this.date} ${this.time}`),
      })
    },
    saveEdit() {
      this.updateTransaction({
        ...this.tx,
        balance_id: this.balance.balance_id,
        type: this.buy ? 'buy' : 'sell',
        total_spent: this.total_spent
          ? this.tx.total_spent
          : this.total_spent_computed,
        rate: this.total_spent ? this.rate_computed : this.tx.rate,
        date: new Date(`${this.date} ${this.time}`),
      })
    },
    ...mapActions('transactions', ['addTransaction', 'updateTransaction']),
  },
  created() {
    if (this.edit) {
      this.tx = {
        ...this.passedTx,
      }
      const txDate = new Date(
        new Date(this.passedTx.date) - new Date().getTimezoneOffset() * 60000
      ).toISOString()
      this.date = txDate.split('T')[0]
      this.time = txDate.split('T')[1].substring(0, 5)
    } else {
      this.tx.rate = this.balance.coin_current_price
    }
    this.default_tx.rate = this.balance.coin_current_price
  },
}
</script>
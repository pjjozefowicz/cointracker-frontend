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
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="tx.rate"
                label="Price per coin"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="tx.amount" label="Amount"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="tx.total_spent"
                label="Total spent"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="tx.date" label="Date"></v-text-field>
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col>
              <v-text-field v-model="tx.fee" label="Fee"></v-text-field>
            </v-col>
          </v-row> -->
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
      </v-card-actions>
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


<template>
  <div>
    <v-row justify="start" align="center">
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>Coinname</v-card-title>
           <v-card-text>
            <div>Price</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>0 PLN</v-card-title>
          <v-card-text>
            <div>Holdings Value</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>0</v-card-title>
          <v-card-text>
            <div>Holdings</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>0</v-card-title>
          <v-card-text>
            <div> Total Cost </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>0 PLN</v-card-title>
          <v-card-text>
            <div>Profit / Loss</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <TransactionsTable />
      </v-col>
    </v-row>
  </div>
</template>


<script>
export default {
  name: 'TransactionsPage',
}
</script>

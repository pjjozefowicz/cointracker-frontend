<template>
  <div>
    <v-row justify="start" align="center">
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>Card Title</v-card-title>
          <v-card-text>
            <div>Word of the Day</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>Card Title</v-card-title>
          <v-card-text>
            <div>Word of the Day</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mx-auto" color="purple">
          <v-card-title>Card Title</v-card-title>
          <v-card-text>
            <div>Word of the Day</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <DashboardTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>

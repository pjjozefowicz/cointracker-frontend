<template>
  <div>
  </div>
</template>


<script>
export default {
  name: 'TransactionsIndex',
  data: () => ({
  }),
  beforeRouteEnter(to, from, next) {
    next("/error")
  }
}
</script>

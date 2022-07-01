<template>
  <v-sparkline
    :value="data"
    :gradient="gradient"
    :smooth="radius || false"
    :padding="padding"
    :line-width="width"
    :stroke-linecap="lineCap"
    :gradient-direction="gradientDirection"
    :fill="fill"
    :type="type"
    :auto-line-width="autoLineWidth"
    auto-draw
  ></v-sparkline>
</template>

<script>
// const gradients = [
//   ['#222'],
//   ['#42b3f4'],
//   ['red', 'orange', 'yellow'],
//   ['purple', 'violet'],
//   ['#00c6ff', '#F0F', '#FF0'],
//   ['#f72047', '#ffd200', '#1feaea'],
//   ["red"],
//   ["green"]
// ]
export default {
  name: 'SparkLine',
  props: ['data'],
  data: () => ({
    width: 3,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradientDirection: 'top',
    // gradients,
    fill: false,
    type: 'trend',
    autoLineWidth: false
  }),
  computed: {
    gradient () {
      return this.data[0] < this.data.at(-1) ? ["green"] : ["red"]
    } 
  }
}
</script>
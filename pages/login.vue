<template>
  <v-row class="mt-12">
    <v-col class="text-center">
      <cryptoicon symbol="btc" size="128" class="ml-6"/>
      <blockquote class="blockquote">
        &#8220;In order to use this app, u need to login bro.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LoginPage',
  // beforeMount() {
  //     this.$auth.loginWith('auth0')
  // }
}
</script>

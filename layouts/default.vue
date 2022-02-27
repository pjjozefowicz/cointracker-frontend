<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-btn outlined to="/">
        <v-icon class="mr-2">mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <v-divider color="white" vertical></v-divider>
      <v-spacer />
      <div v-if="$auth.loggedIn">
        {{ $auth.user.email }}
        <v-btn text @click="logoutUser">Logout</v-btn>
      </div>
      <div v-else>
        <v-btn text to="/login" @click="loginUser">Login</v-btn>
      </div>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-format-list-bulleted-square',
          title: 'Transactions',
          to: '/transactions',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  methods: {
    loginUser() {
      this.$auth.loginWith('auth0')
    },
    async logoutUser() {
      await this.$auth.logout()
    },
    ...mapActions('portfolios', ['setPortfolios']),
    ...mapActions('balances', ['getCoins']),
    // ...mapActions([
    //   'rootTest',
    // ]),
  },
  computed: {
    ...mapGetters(['initialized']),
  },
  beforeMount() {
    console.log('Hello, beforeMount() here')
    if (this.$auth.loggedIn && !this.initialized) {
      console.log('Portfolios state is not initialized, getting them now...')
      this.setPortfolios()
    }
  },
}
</script>

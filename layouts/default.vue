<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app disable-resize-watcher>
      <div v-if="$auth.loggedIn">
        <div class="d-flex justify-center align-center mt-3">
          <p>{{ $auth.user.email }}</p>
        </div>
        <v-list>
          <v-list-item to="/" router exact @click="drawer = false">
            <v-list-item-action>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/logout" router exact @click="logoutUser">
            <v-list-item-action>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <div v-else>
        <v-list>
          <v-list-item to="/login" router exact @click="loginUser">
            <v-list-item-action>
              <v-icon>mdi-login-variant</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="drawer = false">
            <v-list-item-action>
              <v-icon>mdi-arrow-left-thin</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Go back</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-sm-and-up"
      />
      <v-btn text @click="goToDashboard" class="hidden-xs-only" large>
        <v-icon class="mr-2">mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer />
      <div v-if="$auth.loggedIn" class="d-flex align-center justify-center">
        <p class="mb-0 mr-2">{{ $auth.user.email }}</p>
      </div>
      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{
          $vuetify.theme.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'
        }}</v-icon>
      </v-btn>
      <v-btn
        v-if="$auth.loggedIn"
        class="hidden-xs-only"
        text
        @click="logoutUser"
        >Logout</v-btn
      >
      <div v-if="!$auth.loggedIn">
        <v-btn text to="/login" @click="loginUser">Login</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
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
          title: 'Logout',
          to: '/transactions',
        },
      ],
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  methods: {
    goToDashboard() {
      this.$router.push({
        path: '/',
      })
    },
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
    if (this.$auth.loggedIn && !this.initialized) {
      this.setPortfolios()
    }
  },
}
</script>

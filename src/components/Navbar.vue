<template>
  <div>
    <v-app-bar dark>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Classo.</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text v-for="item in navItems" :key="item.title" :to="item.path">
          {{ item.title }}
        </v-btn>
        <v-btn text to="/login" v-if="!$store.state.user">Login/Register</v-btn>
        <v-menu offset-y v-if="$store.state.user">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              {{ $store.state.user.email }} <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item class="dropdown">
              <v-list-item-title @click="logout">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer style="z-index: 2147483647;" color="#3C5E5D" v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="white--text text--accent-4">
          <v-list-item class="pa-0" v-for="item in navItems" :key="item.title" :to="item.path">
            <v-list-item-title class="item">{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="pa-0" v-if="$store.state.user" @click="logout">
            <v-list-item-title class="item">Logout <v-icon color="white">mdi-door-open</v-icon></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  name: "Navbar",
  props: ["isAuthenticated"],
  data() {
    return {
      drawer: false,
      group: null,
      appTitle: "Awesome App",
      sidebar: false,
      navItems: [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Focus", path: "/focus" },
        { title: "Calendar", path: "/calendar" },
        { title: "Forum", path: "/forum" },
        // { title: "Login/Register", path: "/login" },
      ],
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");

      this.$router.push("/login");
    },
  },
};
</script>
<style lang="css" scoped>
.v-app-bar {
  background: #3c6563 !important;
}

.v-toolbar__title {
  font-weight: 600 !important;
}
.dropdown:hover {
  background-color: rgb(0, 0, 0, 0.1);
  cursor: pointer;
}
.item {
  color: white;
  font-size: 18px !important;
  padding: 15px;
}
.item:hover {
  background-color: rgb(0, 0, 0, 0.1);
}
</style>

<template>
  <v-app>
    <!-- Fixed Rendering -->
    <Navbar />

    <!-- Dynamic Rendering -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      navigation: null,
    };
  },
  created() {
    // life cycle hook
    this.$store.dispatch("fetchUser");

    this.checkRoute();
  },
  mounted() {},
  methods: {
    checkRoute() {
      if (this.$route.name === "Login" || this.$route.name === "Register") {
        this.navigation = true;
        return;
      }
      this.navigation = false;
    },
  },
  watch: {
    // when route is switch, call the function checkRoute
    $route() {
      this.checkRoute();
    },
  },
};
</script>
<style>
  v-main{
    /* margin: 0; */
  }
</style>
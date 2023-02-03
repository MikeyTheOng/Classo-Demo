import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@/assets/css/main.css";
import VueSweetalert2 from "vue-sweetalert2";
import LoadingOverlay from "./components/LoadingOverlay";

// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

Vue.component("loading-overlay", LoadingOverlay);

new Vue({
  created() {
    AOS.init();
  },
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

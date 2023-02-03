<template>
  <div class="login">
    <div data-aos="fade-up" data-aos-duration="1000">
      <Modal v-if="modalActive" />
      <v-container>
        <form @submit.prevent="submit">
          <v-card elevation="2" class="pa-16">
            <h1 class="ps-0">Login to Classo</h1>
            <v-card-subtitle class="ps-0">
              Don't have an account?
              <router-link class="router-link" :to="{ name: 'Register' }">Register</router-link>
            </v-card-subtitle>
            <v-text-field type="email" v-model="email" label="Email" required></v-text-field>
            <v-text-field type="password" v-model="password" label="Password" required></v-text-field>

            <v-btn block large color="#3c6563" dark @click="login"
              >Login
              <v-icon dark right> mdi-arrow-right</v-icon>
            </v-btn>
          </v-card>
        </form>
        <!-- accessing the global state from store -->
        <!-- {{ $store.state.account.email }} -->
      </v-container>
    </div>
  </div>
</template>

<script>
import "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseinit";
import { doc, setDoc } from "firebase/firestore";

export default {
  name: "Login",

  data() {
    return {
      email: null,
      password: null,
      modalActive: null,
      modalMessage: "",
    };
  },
  methods: {
    async login() {
      this.$store.dispatch("authenticate");
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          // this.showAlertSuccess();
          this.$router.push({ name: "Dashboard" });
        })
        .catch((err) => {
          switch (err.code) {
            case "auth/user-not-found":
              this.showAlertFail("User not found.");
              break;
            case "auth/wrong-password":
              this.showAlertFail("Wrong password.");
              break;
            default:
              console.log(err.message);
              this.showAlertFail("Something went wrong");
          }
          return;
        });
    },
    showAlertSuccess() {
      // Use sweetalert2
      this.$swal.fire("Success ", "Login Successfully.", "success");
    },
    showAlertFail(message) {
      // Use sweetalert2
      this.$swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    },
  },
};
</script>

<style lang="css" scoped>
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 40rem;
  max-width: 100%;
}

h1 {
  font-weight: 500;
}
</style>

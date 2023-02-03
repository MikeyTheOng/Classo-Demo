<template>
  <div class="register">
    <div data-aos="fade-up" data-aos-duration="1000">
      <v-container>
        <form @submit.prevent="submit">
          <v-card elevation="2" class="pa-16">
            <h1 class="ps-0">Register an Account</h1>
            <v-card-subtitle class="ps-0">
              Already have an account?
              <router-link class="router-link" :to="{ name: 'Login' }">Login</router-link>
            </v-card-subtitle>
            <v-text-field type="text" v-model="name" label="Name" required></v-text-field>

            <v-text-field type="email" v-model="email" label="Email" required></v-text-field>
            <v-text-field type="password" v-model="password" label="Password" required></v-text-field>
            
            <v-btn block large color="#3c6563" dark @click="register"
              >Create Account <v-icon dark right> mdi-arrow-right</v-icon>
            </v-btn>
          </v-card>
        </form>
      </v-container>
    </div>
  </div>
</template>

<script>
import "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseinit";
import { doc, setDoc } from "firebase/firestore";

export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "",
    };
  },
  methods: {
    async register() {
      // valid fields
      if (this.name !== "" && this.email !== "" && this.password !== "") {
        // check if SMU user based on email
        let emailParts = this.email.split("@");

          // check if prof or stud and assign user role: benjamingan@smu.edu.sg, tjandrap.2021@smu.edu.sg
          let checkLengthOfParts = emailParts[0].split(".").length;

          // students [tjandrap, 2021]
          if (checkLengthOfParts > 1) {
            this.role = "student";
          } else {
            this.role = "professor";
          }

          // creating a user
          createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((cred) => {
              return setDoc(doc(db, "users", cred.user.uid), {
                name: this.name,
                user_role: this.role,
                channel_role: "",
                user_email: this.email,
                profile_description: "",
              }).then(() => {
                this.showAlertSuccess();
                this.$router.push({ name: "Dashboard" });
              });
            })
            .catch((err) => {
              if(this.password.length < 6){
                this.showAlertError("Password must be at least 6 characters long")
              } else {
                switch (err.code) {
                  case "auth/email-already-in-use":
                    this.showAlertError("Email already in use");
                    break;
                  case "auth/invalid email":
                    this.showAlertError("Invalid email");
                    break;
                  case "auth/operation-not-allowed":
                    this.showAlertError("Operation now allowed");
                    break;
                  default:
                    this.showAlertError("Something went wrong");
                }
              }
            });

          return;

      }
      // invalid fields
      console.log("Fields are empty.");
      this.showAlertError("Please fill out all the fields!");
      return;
    },
    showAlertSuccess() {
      // Use sweetalert2
      this.$swal.fire("Success ", "Congratulations, your account has been successfully created.", "success");
    },
    showAlertError(message) {
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
.register {
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

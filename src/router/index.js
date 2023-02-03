import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import Dashboard from "../views/Dashboard.vue";
import Focus from "../views/Focus.vue";
import ForumView from "../views/ForumView.vue";
import ForumProfileView from "../views/ForumProfileView.vue";
import ForumChannelView from "../views/ForumChannelView.vue";
import ForumPostView from "../views/ForumPostView.vue";
import Calendar from "../views/Calendar.vue";

import { auth, db } from "../firebase/firebaseinit";

Vue.use(VueRouter);

function guardMyroute(to, from, next) {
  auth.onAuthStateChanged(async (user) => {
    if (user === null) {
      // logging out user
      next("/login");
    } else {
      next();
    }
  });
  // var isAuthenticated = auth.currentUser;

  // if (isAuthenticated) {
  //   next(); // allow to enter route
  // } else {
  //   next("/login"); // go to '/login';
  // }
}

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: guardMyroute,
  },
  {
    path: "/focus",
    name: "Focus",
    component: Focus,
    beforeEnter: guardMyroute,
  },
  {
    path: "/forum",
    name: "Forum",
    component: ForumView,
    beforeEnter: guardMyroute,
  },
  {
    path: "/forum-profile/:user_id",
    name: "ForumProfile",
    component: ForumProfileView,
    beforeEnter: guardMyroute,
  },
  {
    path: "/forum-channel/:channel_id",
    name: "ForumChannel",
    component: ForumChannelView,
    beforeEnter: guardMyroute,
  },
  {
    path: "/forum-post/:post_id",
    name: "ForumPost",
    component: ForumPostView,
    beforeEnter: guardMyroute,
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
    beforeEnter: guardMyroute,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;

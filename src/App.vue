<template>
  <nav>
    <router-link @click="fireBase.createBlog = true" to="/">Home</router-link> |
    <router-link @click="fireBase.createBlog = true" to="/createBlog">{{
      fireBase.createBlog ? "Create Blog" : "Edit Blog"
    }}</router-link>
    |
    <router-link
      @click="fireBase.createBlog = true"
      v-if="!fireBase.loggedIn"
      to="/login"
      >{{ fireBase.showSignInForm ? "Log in" : "Sign up" }}</router-link
    >
    <span v-else @click="fireBase.logOut">Log out</span>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useFireBase } from "./stores/FireBase";

export default defineComponent({
  name: "logIn",
  setup() {
    const fireBase = useFireBase();
    fireBase.authChange();
    return {
      fireBase,
    };
  },
});
</script>

<style>
nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav span {
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

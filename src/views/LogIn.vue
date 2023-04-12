<template>
  <div class="container__form">
    <!-- Login form -->
    <div class="login" v-if="fireBase.showSignInForm">
      <h1>Login</h1>
      <form @submit.prevent="fireBase.signin(signInEmail, signInPassword)">
        <div class="txt_field">
          <input type="text" required="true" v-model="signInEmail" />
          <span></span>
          <label>Username</label>
        </div>
        <div class="txt_field">
          <input type="password" required="true" v-model="signInPassword" />
          <span></span>
          <label>Password</label>
        </div>
        <div class="submitBtn">
          <p class="text-danger" v-if="!fireBase.signInValid">
            {{ fireBase.errorMsg }}
          </p>
          <button
            :disabled="fireBase.loginReq"
            :id="fireBase.loginReq ? 'disabled' : ''"
            type="submit"
          >
            <span v-if="!fireBase.loginReq">Login</span>
            <span v-if="fireBase.loginReq"> Please Wait...</span>
          </button>
        </div>

        <div class="signup_link">
          Don't have account?
          <span @click="toggleForm">Sign up</span>
        </div>

        <!-- Log in using google -->
        <div class="break">
          <div class="line"></div>
          <span>OR</span>
          <div class="line"></div>
        </div>
      </form>
      <div class="google">
        <button @click="fireBase.singInWithGoogle">
          <i class="fa fa-google" aria-hidden="true"></i>
          <span class="text">Continue with Google</span>
        </button>
      </div>
    </div>

    <!-- Sign up form -->
    <div class="signup" v-else>
      <h1>Sign up</h1>
      <form
        @submit.prevent="
          fireBase.signUp(firstName, lastName, signUpEmail, signUpPassword)
        "
      >
        <div class="txt_field">
          <input type="text" required="true" v-model="firstName" />
          <span></span>
          <label>First Name</label>
        </div>
        <div class="txt_field">
          <input type="text" required="true" v-model="lastName" />
          <span></span>
          <label>Last Name</label>
        </div>
        <div class="txt_field">
          <input type="text" required="true" v-model="signUpEmail" />
          <span></span>
          <label>Username</label>
        </div>
        <div class="txt_field">
          <input type="password" required="true" v-model="signUpPassword" />
          <span></span>
          <label>Password</label>
        </div>
        <div class="submitBtn">
          <p class="text-danger" v-if="!fireBase.signUpValid">
            {{ fireBase.errorMsg }}
          </p>
          <button
            :disabled="fireBase.signUpReq"
            :id="fireBase.signUpReq ? 'disabled' : ''"
            type="submit"
          >
            <span v-if="!fireBase.signUpReq">Sign up</span>
            <span v-if="fireBase.signUpReq"> Please Wait...</span>
          </button>
        </div>
        <div class="signup_link">
          Already have account?
          <span @click="toggleForm">Log in</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useFireBase } from "../stores/FireBase";
import router from "@/router";

export default defineComponent({
  name: "logIn",
  setup() {
    const fireBase = useFireBase();

    const signInEmail = "",
      signInPassword = "",
      signUpEmail = "",
      signUpPassword = "",
      firstName = "",
      lastName = "";

    return {
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      firstName,
      lastName,
      fireBase,
    };
  },
  methods: {
    toggleForm() {
      this.fireBase.toggleForm();
      this.signInEmail = "";
      this.signInPassword = "";
      this.signUpEmail = "";
      this.signUpPassword = "";
      this.firstName = "";
      this.lastName = "";
    },
  },
  components: {},
});
</script>

<style scoped>
body {
  background-color: #14a44d;
}
</style>

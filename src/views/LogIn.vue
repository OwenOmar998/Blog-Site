<template>
  <div class="container__form">
    <!-- Login form -->
    <div class="login" v-if="fireBase.showSignInForm">
      <h1>Login</h1>
      <form @submit.prevent="fireBase.signin(email, password)">
        <div class="txt_field" :id="emailValidity === 'invalid' ? 'error' : ''">
          <input
            id="email"
            name="email"
            type="text"
            required="true"
            v-model.trim="email"
            @blur="validateEmail"
          />
          <span></span>
          <label for="email">Email</label>
        </div>
        <h5 class="error" v-if="emailValidity === 'invalid'">
          Please enter a valid email!
        </h5>
        <div class="txt_field">
          <input
            id="password"
            name="password"
            type="password"
            required="true"
            v-model.trim="password"
          />
          <span></span>
          <label for="password">Password</label>
        </div>
        <div class="submitBtn">
          <p class="text-danger" v-if="!fireBase.signInValid">
            {{ fireBase.errorMsg }}
          </p>
          <button
            :disabled="fireBase.loginReq || !submitButton"
            :id="fireBase.loginReq || !submitButton ? 'disabled' : ''"
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
        @submit.prevent="fireBase.signUp(firstName, lastName, email, password)"
      >
        <div
          class="txt_field"
          :id="firstNameValidity === 'invalid' ? 'error' : ''"
        >
          <input
            id="first-name"
            name="first-name"
            type="text"
            required="true"
            v-model.trim="firstName"
            @blur="validateFirstName"
          />
          <span></span>
          <label for="firest-name">First Name</label>
        </div>
        <h5 class="error" v-if="firstNameValidity === 'invalid'">
          Please enter a valid name
        </h5>
        <div
          class="txt_field"
          :id="lastNameValidity === 'invalid' ? 'error' : ''"
        >
          <input
            id="last-name"
            name="last-name"
            type="text"
            required="true"
            v-model.trim="lastName"
            @blur="validateLastName"
          />
          <span></span>
          <label>Last Name</label>
        </div>
        <h5 class="error" v-if="lastNameValidity === 'invalid'">
          Please enter a valid name
        </h5>
        <div class="txt_field" :id="emailValidity === 'invalid' ? 'error' : ''">
          <input
            id="email"
            name="email"
            type="text"
            required="true"
            v-model.trim="email"
            @blur="validateEmail"
          />
          <span></span>
          <label for="email">Email</label>
        </div>
        <h5 class="error" v-if="emailValidity === 'invalid'">
          Please enter a valid email
        </h5>
        <div
          class="txt_field"
          :id="passwordValidity === 'invalid' ? 'error' : ''"
        >
          <input
            id="password"
            name="password"
            type="password"
            required="true"
            v-model.trim="password"
            @blur="validatePassword"
          />
          <span></span>
          <label for="password">Password</label>
        </div>
        <h5 class="error" v-if="passwordValidity === 'invalid'">
          Password must be at least 8 characters long and contain at least one
          uppercase letter, one lowercase letter, one number, and one special
          character.
        </h5>
        <div class="submitBtn">
          <p class="text-danger" v-if="!fireBase.signUpValid">
            {{ fireBase.errorMsg }}
          </p>
          <button
            :disabled="fireBase.signUpReq || !submitButton"
            :id="fireBase.signUpReq || !submitButton ? 'disabled' : ''"
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
import { defineComponent, onMounted, ref, watch } from "vue";
import { useFireBase } from "../stores/FireBase";
import router from "@/router";
import { computed } from "@vue/reactivity";

export default defineComponent({
  name: "logIn",
  setup() {
    const fireBase = useFireBase();

    const email = ref(""),
      password = ref(""),
      firstName = ref(""),
      lastName = ref(""),
      emailValidity = ref("pending"),
      firstNameValidity = ref("pending"),
      lastNameValidity = ref("pending"),
      passwordValidity = ref("pending");
    const submitButton = computed(() => {
      if (fireBase.showSignInForm)
        return emailValidity.value === "valid" && password.value.length
          ? true
          : false;
      else
        return emailValidity.value === "valid" &&
          passwordValidity.value === "valid" &&
          firstNameValidity.value === "valid" &&
          lastNameValidity.value === "valid"
          ? true
          : false;
    });

    return {
      email,
      password,
      firstName,
      lastName,
      fireBase,
      emailValidity,
      passwordValidity,
      firstNameValidity,
      lastNameValidity,
      submitButton,
    };
  },
  methods: {
    validateFirstName() {
      const regex = /^[a-zA-Z]{1,}$/;
      regex.test(this.firstName)
        ? (this.firstNameValidity = "valid")
        : (this.firstNameValidity = "invalid");
    },
    validateLastName() {
      const regex = /^[a-zA-Z]{1,}$/;
      regex.test(this.lastName)
        ? (this.lastNameValidity = "valid")
        : (this.lastNameValidity = "invalid");
    },
    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      regex.test(this.email)
        ? (this.emailValidity = "valid")
        : (this.emailValidity = "invalid");
    },
    validatePassword() {
      const regex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      regex.test(this.password)
        ? (this.passwordValidity = "valid")
        : (this.passwordValidity = "invalid");
      console.log(this.password);
    },
    toggleForm() {
      this.fireBase.toggleForm();
      this.email = "";
      this.password = "";
      this.firstName = "";
      this.lastName = "";
      this.emailValidity = "pending";
      this.firstNameValidity = "pending";
      this.lastNameValidity = "pending";
      this.passwordValidity = "pending";
      this.submitButton = false;
    },
  },
  components: {},
});
</script>

<style>
body {
  background-color: #14a44d;
}
#error label {
  color: var(--danger);
}
#error {
  border-bottom-color: var(--danger);
}
</style>

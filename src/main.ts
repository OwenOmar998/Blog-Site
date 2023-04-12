import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/style.css";

import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/functions";
const firebaseConfig = {
  apiKey: "AIzaSyCUGJlsAVAozE7YnT9n0NNpQQW5kvpHdwI",
  authDomain: "blog-site-6059a.firebaseapp.com",
  projectId: "blog-site-6059a",
  storageBucket: "blog-site-6059a.appspot.com",
  messagingSenderId: "640395110978",
  appId: "1:640395110978:web:731f1999a52a791ccc1bdb",
  measurementId: "G-YNBMV52J6Z",
};

const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = firebase.functions();

createApp(App).use(router).use(createPinia()).mount("#app");

export { db, functions };

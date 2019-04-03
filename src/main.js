import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import firebase from "firebase/app";
import 'firebase/firestore';
import {firebaseConfig} from "../env";

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");

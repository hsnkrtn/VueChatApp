<template>
  <div class="row">
    <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
      <h1>InternChat.com</h1>
      <h1>Login</h1>
      <p v-if="isLogedin">u are loggged in !!</p>
      <div class="form-group">
        <label>Username</label>
        <input class="form-control" required type="text" v-model="user.userName">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input class="form-control" required type="text" v-model="user.password">
      </div>
      <button type="submit" class="btn btn-primary" @click="Login(user)">Login</button>
      <button type="submit" class="btn btn-primary" @click="GoToSignUpPage">Sign In</button>
      <p v-if="errorMessage">{{errorMessage}}</p>

      <hr>
    </div>
  </div>
</template>

<script>

import { pathOr } from "../../node_modules/ramda";
import { usersRef } from "../base";
export default {
  data() {
    return {
      user: {
        userName: null,
        password: null
      },
      errorMessage: null,
      isLogedin: false,
      isLoggingIn: true,
      gotErrorDuringLogin: false
    };
  },
  created() {
    const customActions = {
      loginCheck: { method: "GET" }
    };
    this.resource = this.$resource("users.json", {}, customActions);
  },
  methods: {
    Login(user) {
      let resultArray = [];
      usersRef.once("value", snap => {
        resultArray = Object.entries(snap.val()).map(e =>
        
          Object.assign(e[1], { key: e[0] })
        );

        let responseUser = resultArray.filter(
          a => a.userName == user.userName && a.password == user.password
        )[0];
        if (responseUser) {
          this.isLogedin = true;
          this.$emit("LogedInSuccessed", {
            logednInUser: responseUser
          });
          this.errorMessage = null;
        } else {
          this.isLogedin = false;
          this.errorMessage = "Wrong User name or password, please try again";
        }
      });

      // });
    },
    GoToSignUpPage() {
      this.$emit("UserWantsToSignUp", true);
    }
  }
};
</script>

<style>
</style>

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
      <h1>Sign Up</h1>
      <div class="form-group">
        <label>Username</label>
        <input class="form-control" required type="text" v-model="user.userName">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input class="form-control" required type="text" v-model="user.password">
        <div class="radio" v-for="(gender, index) in this.genderOptions" :key="index">
          <input type="radio" :id="gender" :value="gender" v-model="user.gender">
          <label :for="gender">{{gender}}</label>
        </div>
        <label for="dateOfBirth"> Birth date:</label>
        <input type="date" id="dateOfBirth" v-model="user.dateOfBirth">
        <input
          type="file"
          multiple
          :disabled="isSaving"
          @change="avatarUpload"
          accept="image/*"
          class="input-file"
        >
        <p v-if="isSaving">Uploading Image...</p>
      </div>
      <button
        v-if="!userSignedUp"
        type="submit"
        class="btn btn-primary"
        @click="SignUp(user)"
      >Sign In</button>
      <button type="submit" class="btn btn-primary" @click="GoToLoginPage">Login</button>

      <p v-if="isAlreadyUser">{{errorMessage}}</p>
      <hr>
    </div>
  </div>
</template>

<script>
import Guid from "guid";
import newUser from "../constants/newUser";
import { storage } from "../base";
export default {
  data() {
    return {
      user: newUser,
      genderOptions: ["Man", "Woman", "NotSpecified"],
      resource: {},
      errorMessage: "",
      isAlreadyUser: null,
      userSignedUp: false,
      userWantsToSignUp: true,
      isSaving:false
    };
  },
  created() {
    const customActions = {
      checkUser: { method: "GET" }
    };
    this.resource = this.$resource("users.json", {}, customActions);
  },
  methods: {
    SignUp(user) {
      
      this.resource
        .checkUser()
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.users = resultArray;
          if (this.users.some(a => a.userName == user.userName)) {
            this.isAlreadyUser = true;
            this.errorMessage =
              "Username " +
              user.userName +
              " already exists, please try another username";
          } else {
            this.isAlreadyUser = false;
            if (!user.gender) user.gender = "NotSpecified";
            user.id=Guid.raw()
            this.resource.save({}, user);
            this.userSignedUp = true;
            this.$emit("UserSignedUp", true);
            this.reset();
          }
        });
    },
    uploadFile(e) {
      this.$emit("fileUploaded", e);
      console.log("app geldi mi ?", storage);
    },
    isAlreadyAUser(user) {
      this.resource
        .checkUser()
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.users = resultArray;
          if (this.users.some(a => a.userName == user.userName)) {
            this.isAlreadyUser = true;
            this.message = "username" + user.userName + "already exists";
          }
        });
    },
    reset() {
      this.user = {};
    },
    GoToLoginPage() {
      // this.$emit('UserWantsToLogin',true);
      this.$emit("userWantsToLogin", true);
    },
    avatarUpload(e) {
      this.isSaving=true;
      const file = e.target.files[0];
      storage
        .ref("userPics/" + file.name)
        .put(file)
        .then(response => {
          response.ref.getDownloadURL().then(downloadURL => {
            //this.$emit("avatarSaved", downloadURL);
            this.user.avatarUrl = downloadURL;
          });
          this.isSaving=false;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
</style>

<template>
  <v-container
      fluid

      class="d-flex align-center justify-center blue lighten-5"
      style="height: 100%">
          <v-card class="" max-width="400px">
            <v-app-bar elevation="0" color="primary">
              <v-app-bar-title class="white--text">ورود</v-app-bar-title>
            </v-app-bar>
            <v-card-text >
              <v-form ref="loginForm" v-model="formValid" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        required

                        v-model="username"

                        :rules="[rules.required, rules.min]"

                        dir="ltr"
                        label="نام کاربری"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        counter

                        v-model="password"

                        :append-icon="show1?'mdi-eye':'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"

                        dir="ltr"
                        name="input-10-1"
                        label="پسورد"
                        ></v-text-field>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                    <v-btn
                         block

                        :disabled="!formValid"
                        @click="validate"

                        color="primary">ورود</v-btn>
                  </v-col>
                </v-row>
                <v-row
                    v-if="error">
                  <v-col
                      cols="12" class="error--text">{{error}}</v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
  </v-container>
<!--  <form class="login-form" @submit.prevent="handleSubmit">
    <div>
      <v-text-field
          label="نام کاربری"
          v-model="username" />
    </div>

    <div>
      <v-text-field
          label="رمز"
          v-model="password" />
    </div>

    <div>
      <v-btn @click="handleSubmit">ورود</v-btn>
    </div>
  </form>-->
</template>

<script>
import { Meteor } from 'meteor/meteor';

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      show1: false,
      formValid: true,
      error: '',
      rules: {
        required: value => !!value || "الزامی",
        min: v => (v && v.length >= 5) || "حداقل 5 کاراکتر"
      }
    };
  },
  methods: {
    handleSubmit(event) {
      Meteor.loginWithPassword(this.username, this.password, (error, result) => {
        if(error) {
          console.log(error);
          if(error.reason) {
            this.error = error.reason
          }
        } else {
          this.$router.push('/dashboard')
        }
      });
    },
    validate() {
      if (this.$refs.loginForm.validate()) {
        this.handleSubmit();
        // submit form to server/API here...
      }
    },
  },
}
</script>

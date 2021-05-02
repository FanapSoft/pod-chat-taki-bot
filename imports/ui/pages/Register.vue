<template>
  <div>
    <form class="registration-form" @submit.prevent="handleSubmit">
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
        <v-btn @click.prevent="handleSubmit">ثبت نام</v-btn>
      </div>
    </form>

    <v-list>
      <v-list-item v-for="item in users">
        {{item.username}}
        <v-btn @click="deleteItem(item)">X</v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor';

export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      users: null
    };
  },
  methods: {
    getUsers() {
      Meteor.call('usersList', (error, result) => {
        if(error) {
          console.log(error);
          return;
        }
        console.log(result);
        this.users = result
      })
    },
    handleSubmit(event) {
      Accounts.createUser({username:this.username, password: this.password}, (error, result) => {
        if(error) {
          console.log(error)
        } else {
          console.log(result);
          this.users = result;
        }
      });
    },
    deleteItem(item){
      Meteor.users.remove(item._id);
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>

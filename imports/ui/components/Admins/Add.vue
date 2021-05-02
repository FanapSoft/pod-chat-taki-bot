<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="primary"
          dark
          class="mb-2"
          v-bind="attrs"
          v-on="on"
      >
        آیتم جدید
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
<!--        <span class="headline">{{ formTitle }}</span>-->
      </v-card-title>
      <v-card-subtitle v-if="message || error">
        <span v-if="message" class="green--text">{{message}}</span>
        <span v-else-if="error" class="error--text">{{error}}</span>
      </v-card-subtitle>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.username"
                  label="نام کاربری"
              ></v-text-field>
            </v-col>
                        <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.email"
                  label="ایمیل"
              ></v-text-field>
            </v-col>
                        <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.password"
                  label="رمز عبور"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
        >
          لغو
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="save"
        >
          ذخیره
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddAdmin",
  data: () => ({
    dialog: false,
    message: null,
    error: null,
    item: {
      username: '',
      email: '',
      password: ''
    }
  }),
  methods: {
    save () {
      this.resetMessages();

      Meteor.call('usersCreate', this.item.username, this.item.password, (error, result) => {
        if(error) {
          console.log(error);
          this.error = error.reason ? error.reason : 'خطا: کنسول را بررسی کنید'
        } else {
          this.message = 'کاربر ایجاد شد.'
          this.$emit('updateList')
        }
      });
      this.dialog = false;
    },
    reset(){
      this.dialog = false;
      this.resetMessages();
      this.item = {
        username: null,
        email: null,
        password: null
      }
    },
    resetMessages() {
      this.message = '';
      this.error = '';
    }
  }
}
</script>

<style scoped>

</style>

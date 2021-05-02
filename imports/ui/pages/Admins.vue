<template>
  <v-container >
    <v-data-table
        disable-pagination disable-filtering hide-default-footer

        :headers="headers"
        :items="users"

        class="elevation-1">
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-toolbar-title>ادمین ها</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <add @updateList="initialize"></add>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">

        <edit
            :user="item"
            @updateList="initialize"></edit>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
            color="primary"
            @click="initialize"
        >
          رفرش
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">از حذف این آیتم اطمینان دارید ؟</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">تایید</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {Meteor} from "meteor/meteor";
import Add from "../components/Admins/Add"
import Edit from "../components/Admins/Edit";

export default {
  name: "Users",
  components: {Edit, Add},
  data: () => ({

    dialogDelete: false,
    headers: [
      {
        text: 'نام کاربری',
        align: 'start',
        sortable: false,
        value: 'username',
      },
      { text: 'تاریخ ایجاد', value: 'createdAt', sortable: false },
      { text: 'فعالیت ها', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    itemToDelete: null,
    defaultItem: {
      username: 'admin',
      password: 'admin'
    },
    users: []
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'آیتم جدید' : 'ویرایش آیتم'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      Meteor.call('usersList', (error, result) => {
        if(error) {
          console.log(error);
          return;
        }
        console.log(result);
        this.users = result
      })
    },

    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.itemToDelete = item;
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      //this.users.splice(this.editedIndex, 1)
      Meteor.users.remove(this.itemToDelete._id, (error, result) => {
        if(error) {
          console.log(error);
          return;
        }

        console.log(result);
        this.initialize();
      });
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },


  },
}
</script>

<style scoped>

</style>

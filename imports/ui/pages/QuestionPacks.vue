<template>
  <v-container >
    <div class="row">
      <div class="col-md-12">
        <v-card>
          <v-data-table
              v-if="questionPacks"

              disable-sort hide-default-footer disable-pagination

              :headers="listHeaders"
              :items="questionPacks"
              :page.sync="pagination.currentPage"
              :loading="loading"
              :items-per-page="20"
              :footer-props="{
                            showFirstLastPage: true,
                            firstIcon: 'mdi-arrow-collapse-left',
                            lastIcon: 'mdi-arrow-collapse-right',
                            prevIcon: 'mdi-minus',
                            nextIcon: 'mdi-plus'
                        }"

              item-key="id"
              class="elevation-1">
            <template v-slot:top>
              <v-toolbar
                  flat
              >
                <v-toolbar-title>پک های سوالات</v-toolbar-title>
                <v-divider
                    inset vertical

                    class="mx-4"
                ></v-divider>
                <v-spacer></v-spacer>
                <span >{{ pagination.realCount.toLocaleString() }}</span>
                <v-divider
                    inset vertical

                    class="mx-4"
                ></v-divider>
                <add ></add>
              </v-toolbar>
            </template>
            <template v-slot:item.ind="{ item }">
              {{ (pagination.skip ? pagination.skip + questionPacks.indexOf(item) + 1 : questionPacks.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.date="{ item }">
              <div>

<!--                {{item.startsAt.toLocaleString()}}-->
                {{new Intl.DateTimeFormat('fa', {
                  dateStyle: 'medium',
                  timeStyle: 'medium'
              }).format(item.startsAt)}}
              </div>
              <div>{{new Intl.DateTimeFormat('fa', {
                dateStyle: 'medium',
                timeStyle: 'medium'
              }).format(item.endsAt)}}</div>
            </template>
            <template v-slot:item.status="{ item }">
              <span v-if="item.status==1">شروع شده</span>
              <span v-else-if="item.status==2">تمام شده</span>
              <span v-if="item.status==3">شروع خواهد شد</span>
            </template>
            <template v-slot:item.actions="{ item, index }">
              <v-switch v-model="item.active" @change="deactivateAllPacksExcept(item)"></v-switch>
              <v-icon @click="addQuestionsTo(item)">mdi-plus</v-icon>
              <edit
                  :key="index"
                  :pack="item" @updateList="() => {questionPacks}"></edit>
              <v-icon
                  @click="deleteItem(item._id)"
                  size="20">mdi-trash-can</v-icon>
            </template>
          </v-data-table>

          <v-pagination
              v-model="pagination.currentPage"

              :total-visible="($vuetify.breakpoint.width - $vuetify.application.left - 404) / 44 - 1"
              :length="pagination.count"

              class="mt-4 pb-2"></v-pagination>
        </v-card>
      </div>
    </div>
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
import QuestionPacks from "../../api/collections/QuestionPacks";
import Add from "../components/QuestionPacks/Add"
import Edit from "../components/QuestionPacks/Edit";

export default {
  name: "QuestionPacks",
  components: {Edit, Add},
  data: () => ({
    dialogDelete: false,
    listHeaders: [
      {text: 'ردیف', value: "ind"},
      //{ text: "creditAmount", value: "creditAmount" },
      {text: 'شروع/پایان', value: "date"},
      {text: 'مدت زمان', value: "duration"},
      {text: 'threshold', value: "threshold"},
      {text: 'عنوان پک سوال', value: "title"},
      {text: 'وضعیت پک', value: "status"},
      {text: 'فعالیت ها', value: "actions"},

    ],
    loading: false,
    pagination: {
      limit: 10,
      count: 0,
      realCount: 0,
      skip: 0,
      currentPage: 1,
      perPage: 10
    },
    itemToDelete: null
  }),

  computed: {
  },
  meteor: {
    $subscribe: {
      'QuestionPacks': []
    },
    questionPacks() {
      this.loading = true;
      //this.pagination.currentPage;
      this.calcCurrentPage();

      const count = QuestionPacks.find().count();
      const res = QuestionPacks.find({},{sort: {createdAt: -1}, limit: this.pagination.perPage, skip: this.pagination.skip});
      this.pagination.count = count ? Math.ceil(count / this.pagination.perPage) : 1;
      this.pagination.realCount = count;
      this.loading = false;
      return res
    }
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    },
  },
  created () {

  },
  methods: {
    calcCurrentPage() {
      if (!this.pagination.currentPage || this.pagination.currentPage == 1) {
        this.pagination.skip = 0;
        this.pagination.currentPage = 1;
      } else if (this.pagination.currentPage > 1) {
        this.pagination.skip = this.pagination.limit * (this.pagination.currentPage - 1);
      }
    },
    resetFields() {
      this.refreshList()
    },
    async refreshList() {
      this.questionPacks
      //await this.getItems(this.pagination.currentPage);
    },
    deleteItem (item) {
      this.itemToDelete = item;
      this.dialogDelete = true
    },
    addQuestionsTo(pack) {
      if(!pack)
        return;

      this.$router.push('/questions?packId=' + pack._id)
    },
    deactivateAllPacksExcept (item) {
      Meteor.call('deactivateAllPacksExcept', item, (error, result) => {
        if(error) {
          console.log(error);
          return;
        }

        console.log(result);
      })
      this.closeDelete()
    },
    deleteItemConfirm () {
      Meteor.call('questionPackRemove', this.itemToDelete, (error, result) => {
        if(error) {
          console.log(error);
          return;
        }

        console.log(result);
      })
      this.closeDelete()
    },

    close () {
      this.dialog = false
    },

    closeDelete () {
      this.dialogDelete = false
    },
  },
}
</script>

<style scoped>

</style>

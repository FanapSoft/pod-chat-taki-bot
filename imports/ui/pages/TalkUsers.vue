<template>
  <v-container >
    <div class="row">
      <div class="col-md-12">
        <v-card>
          <v-data-table
              v-if="questionsList"

              disable-sort hide-default-footer disable-pagination

              :headers="listHeaders"
              :items="questionsList"
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
                <v-toolbar-title>سوالات</v-toolbar-title>
                <v-divider
                    inset vertical

                    class="mx-4"
                ></v-divider>
                <v-autocomplete
                    v-model="filterPackId"
                    :items="searchQuestionPacksList"
                    :loading="isLoadingPacks"
                    :search-input.sync="searchPacks"
                    color="white"
                    hide-no-data
                    hide-selected
                    hide-details
                    dense
                    solo filled
                    item-text="title"
                    item-value="_id"
                    label="انتخاب دسته سوالات"
                    placeholder="برای فیلتر عنوان دسته را تایپ کنید"
                    prepend-icon="mdi-database-search"
                ></v-autocomplete>
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
              {{ (pagination.skip ? pagination.skip + questionsList.indexOf(item) + 1 : questionsList.indexOf(item) + 1) }}
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
              <edit
                  :key="index"
                  :question="item" @updateList="() => {questionsList}"></edit>
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
import Questions from "../../api/collections/Questions";
import Add from "../components/Questions/Add"
import Edit from "../components/Questions/Edit";
import QuestionPacks from "../../api/collections/QuestionPacks";

export default {
  name: "Questions",
  components: {Edit, Add},
  data: () => ({
    dialogDelete: false,
    listHeaders: [
      {text: 'ردیف', value: "ind"},
      {text: 'شماره سوال', value: "order"},
      {text: 'عنوان سوال', value: "question"},
      {text: 'پاسخ های صحیح', value: "correctAnswers"},
      {text: 'امتیاز  مثبت', value: "positiveScore"},
      {text: 'امتیاز  منفی', value: "negativeScore"},
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
    itemToDelete: null,

    isLoadingPacks: false,
    filterPackId: null,
    searchPacks: null
  }),

  computed: {
  },
  meteor: {
    $subscribe: {
      'SSOUsers': []
    },
    searchQuestionPacksList() {
      let reg = new RegExp(this.searchPacks);
      this.isLoadingPacks = false;
      return QuestionPacks.find({title: {$regex: reg} })
    },
    questionsList() {
      this.loading = true;
      //this.pagination.currentPage;
      this.calcCurrentPage();

      let packId = null;

      if(this.$route.query.packId) {
        packId = this.$route.query.packId
      }

      const field = packId ? {packId: packId} : {}

      const count = Questions.find().count();
      const res = Questions.find(field, {sort: {createdAt: -1}, limit: this.pagination.perPage, skip: this.pagination.skip});
      this.pagination.count = count ? Math.ceil(count / this.pagination.perPage) : 1;
      this.pagination.realCount = count;
      this.loading = false;
      return res
    }
  },
  watch: {
    filterPackId(val) {
      if(val)
        this.$router.push('/questions?packId=' + val)
      else
        this.$router.push('/questions')
    },
    searchPacks (val) {
      if (this.isLoadingPacks) return

      this.isLoadingPacks = true

      this.searchQuestionPacksList
    },
    'pagination.currentPage'(val) {
      this.refreshList();
    },
  },
  mounted() {
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
      this.questionsList
      //await this.getItems(this.pagination.currentPage);
    },
    deleteItem (item) {
      this.itemToDelete = item;
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      Meteor.call('questionRemove', this.itemToDelete, (error, result) => {
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

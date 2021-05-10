<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon
          small
          class="mr-2"
          v-bind="attrs"
          v-on="on"
      >
        mdi-pencil
      </v-icon>
    </template>
    <v-card>
      <v-card-subtitle v-if="message || error">
        <span v-if="message" class="green--text">{{ message }}</span>
        <span v-else-if="error" class="error--text">{{ error }}</span>
      </v-card-subtitle>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col
                cols="12"

            >
              <v-autocomplete
                  v-model="item.packId"
                  :items="searchQuestionsList"
                  :loading="isLoadingPacks"
                  :search-input.sync="searchPacks"
                  color="white"
                  hide-no-data
                  hide-selected
                  item-text="title"
                  item-value="_id"
                  label="انتخاب دسته سوالات"
                  placeholder="برای جستجو عنوان دسته را تایپ کنید"
                  prepend-icon="mdi-database-search"
              ></v-autocomplete>
              <!--              <v-text-field
                                v-model="item.question"
                                label="پک سوال"
                            ></v-text-field>-->
            </v-col>
            <v-col
                cols="12"

            >
              <v-text-field
                  v-model="item.question"
                  label=" سوال"
              ></v-text-field>
            </v-col>

            <v-col cols="6" class="px-1 py-2">
              <v-text-field
                  hide-details

                  v-model="answerText"

                  label="متن پاسخ"></v-text-field>
            </v-col>
            <v-col cols="4" class="px-1 py-2 d-flex align-center">
              <v-text-field
                  hide-details

                  v-model="answerKey"

                  label="کلید پاسخ"></v-text-field>
            </v-col>
            <v-col cols="2" class="px-1 py-2">
              <v-btn
                  depressed

                  @click="addAnswer"

                  class="green text--white">
                <v-icon class="text--white">mdi-plus</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <div v-if="item.answers && item.answers.length">
                <div
                    v-for="(it, index) in item.answers"
                    class="d-flex align-center mb-1"
                    style="background: #ddd;">
                  <span class="px-1">متن: {{it.text}}</span>
                  <span class="px-1">کلید: {{it.key}}</span>
                  <v-btn
                      icon depressed
                      @click="() => {item.answers = item.answers.filter((item, ind) => ind !== index); item.correctAnswers = []}"
                      class="mr-auto"><v-icon>mdi-delete</v-icon></v-btn>
                </div>
              </div>
            </v-col>
            <v-col cols="12">
              <v-switch
                  v-model="item.showAnswersToUser"

                  label="نمایش پاسخ ها به کاربر ؟"
              ></v-switch>
            </v-col>

            <!--            <v-col
                            cols="12"
                        >
                          <v-text-field

                              id="startsAt-input"
                              label="پاسخ">
                            <template v-slot:append>
                              <v-btn
                                  depressed

                                  @click="addAnswer"

                                  class="green text&#45;&#45;white">
                                <v-icon class="text&#45;&#45;white">mdi-plus</v-icon>
                              </v-btn>
                            </template>
                          </v-text-field>
                          <div v-if="item.answers && item.answers.length">
                            <div v-for="it in item.answers">
                              <span>{{it.text}}</span>
                              <v-spacer></v-spacer>
                              <v-btn icon depressed class="text&#45;&#45;white"><v-icon>mdi-delete</v-icon></v-btn>
                            </div>
                          </div>
                        </v-col>-->
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.negativeScore"

                  label="امتیاز منفی">
              </v-text-field>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.positiveScore"

                  label="امتیاز مثبت"
              ></v-text-field>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-select
                  multiple

                  v-model="item.correctAnswers"

                  :items="item.answers"

                  label="پاسخ های صحیح"
                  item-text="text"
                  item-value="key"></v-select>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              {{item.correctAnswers.join(',')}}
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.order"

                  label=" شماره سوال"
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
import QuestionPacks from "../../../api/collections/QuestionPacks";

export default {
  name: "EditQuestion",
  props: {
    question: null
  },
  data: () => ({
    dialog: false,
    message: null,
    error: null,
    item: {
      packId: null,
      question: null,
      answers: [],
      correctAnswers: [],
      negativeScore: 3,
      positiveScore: 10,
      order: 1,
      showAnswersToUser: false
    },
    startsAt: null,
    endsAt: null,
    startsAtVisibility: false,
    endsAtVisibility: false,

    isLoadingPacks: false,
    searchPacks: null,

    answerKey: null,
    answerText: null
  }),
  meteor: {
    $subscribe: {
      'QuestionPacks': []
    },
    searchQuestionsList() {
      let reg = new RegExp(this.searchPacks)
      return QuestionPacks.find({title: {$regex: reg} })
    }
  },
  mounted() {
    this.$set(this, 'item' , this.question);
  },
  methods: {
    save() {
      this.resetMessages();
      Meteor.call('questionUpdate', this.item, (error, result) => {
        if (error) {
          console.log(error);
          this.error = error.reason ? error.reason : 'خطا: کنسول را بررسی کنید'
        } else {
          this.message = ' ایجاد شد.'
        }
      });
      this.dialog = false;
    },
    reset() {
      this.dialog = false;
      this.resetMessages();
      this.item = {
        question: null,
        answers: [],
        correctAnswers: [],
        negativeScore: 3,
        positiveScore: 10,
        order: 0
      }
    },
    resetMessages() {
      this.message = '';
      this.error = '';
    },
    addAnswer() {
      this.item.answers.push({
        key: this.answerKey,
        text: this.answerText
      });
      this.answerKey = null;
      this.answerText = null
    }
  },
  watch: {
    searchPacks (val) {
      /*
            // Items have already been loaded
            if (this.packs.length > 0) return
      */


      // Items have already been requested
      if (this.isLoadingPacks) return

      this.isLoadingPacks = true

      this.searchQuestionsList
      console.log(this.item)
    },
  }
}
</script>

<style scoped>

</style>

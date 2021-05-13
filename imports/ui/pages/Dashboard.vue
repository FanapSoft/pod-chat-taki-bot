<template>
  <v-container >
    <v-card class="mb-2">
      <v-card-title>اطلاعات دسته سوال
        {{ activeQuestionPack.title }}
      </v-card-title>
      <v-card-text>
        <div>
          مجموع پیام های ارسالی ربات:
          {{activeQuestionPack.totalMessagesSentByBot }}
        </div>
        <div>
          مجموع پیام های دریافتی ربات:
          {{activeQuestionPack.totalMessagesBotReceived }}
        </div>

      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>لاگ های ربات</v-card-title>
      <v-card-text style="box-shadow: inset 0 0 4px #777; height: 400px; padding-top: 10px !important; overflow-y: auto">
        <div v-for="log in logsList" class="mt-1"  style="background-color: #f3f3f3; margin-top: 3px;">
          <span class="ml-2" style="color: blueviolet">
            <{{moment(log.time).format('jM/jD HH:mm:ss')}}>
          </span>
          {{log.message}}
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import BotLogs from "../../api/collections/BotLogs";
import moment from 'jalali-moment'
import QuestionPacks from "../../api/collections/QuestionPacks";
export default {
  name: "Dashboard",
  meteor: {
    $subscribe: {
      'BotLogs': [],
      'QuestionPacks':[]
    },
    logsList() {
      return BotLogs.find({}, {sort: {time: -1},limit: 50});
    },
    activeQuestionPack(){
      return QuestionPacks.findOne({active: true})
    }
  },
  data: () => ({
    moment: moment
  }),
  mounted() {
    console.log(this.logsList)
  }
}
</script>

<style scoped>

</style>

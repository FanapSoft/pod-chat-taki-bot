<template>
  <v-container>
    <v-card >
      <div>
        <span
            v-if="adminClientStatus.active"

            class="green--text">کلاینت ادمین فعال است. پروفایل ادمین در کنسول پرینت شد</span>
        <span
            v-else

            class="red--text">کلاینت ادمین غیرفعال است</span>
      </div>
      <div>
        <span class="red--text">خطا: </span>
        <span v-if="adminClientStatus.error" class="red--text">{{adminClientStatus.error}}</span>
        <span v-else>خطایی نیست</span>
      </div>
    </v-card>
    <v-card class="mt-4">
      <div>
        <span
            v-if="botClientStatus.active"

            class="green--text">کلاینت ربات فعال است</span>
        <span
            v-else

            class="red--text">کلاینت ربات غیرفعال است</span>
      </div>
      <div>
        <span class="red--text">خطا: </span>
        <span v-if="botClientStatus.error" class="red--text">{{botClientStatus.error}}</span>
        <span v-else>خطایی نیست</span>
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-simple-table>
        <template v-slot:default>
          <tbody >
          <tr >
            <th>ایجاد یک اکانت ربات </th>
            <td >
              <v-text-field
                  v-model="botUsername"

                  label="نام کاربری ربات"
              >
                <template v-slot:append>
                  <v-btn
                      @click="createBot">ایجاد</v-btn>
                </template>
              </v-text-field>
            </td>
          </tr>
          <tr >
            <th>ثبت دستورات برای ربات</th>
            <td >
              <div>برای انجام این مورد باید توکن ربات را دریافت کرده و در تنظیمات ذخیره نمایید و ربات را فعال نمایید.</div>
              <v-text-field v-model="botCommandsList" dir="ltr">
                <template v-slot:append>
                  <v-btn
                      @click="defineBotCommands">ثبت</v-btn>
                </template>
              </v-text-field>
            </td>
          </tr>
          <tr >
            <th>افزودن ربات به یک چت</th>
            <td >
              <div>برای این کار باید به talk..pod.ir بروید و با ارسال یک پیام در گروه شناسه ترد گروه را بیابید و شناسه را در زیر وارد نمایید. دقت کنید که ربات فقط از این ترد قابل استارت خواهد بود</div>
              <v-text-field v-model="chatThreadId" label="Chat Thread Id" dir="ltr">
                <template v-slot:append>
                  <v-btn
                      @click="addBotToThread">افزودن</v-btn>
                </template>
              </v-text-field>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card
        v-if="commandsResult"

        style="direction: ltr !important;"
        class="mt-4">
      INFO:
      <div >{{commandsResult}}</div>
    </v-card>
  </v-container>
</template>

<script>
import Configs from "../../api/collections/Configs"
export default {
  name: "Configs",
  data:()=>({
    message: '',
    error: '',
    botUsername: null,
    commandsResult: null,
    botCommandsList: '',
    chatThreadId: null
  }),
  created() {
  },
  computed: {

  },
  meteor: {
    $subscribe: {
      'Configs': [],
    },
    botClientStatus() {
      const res = Configs.findOne('botClientStatus');
      return res ? res.value : {};
    },
    adminClientStatus() {
      const res = Configs.findOne('adminClientStatus');
      return res ? res.value : {};
    },
    loadDefaultValues() {
      const commands = Configs.findOne("botCommands");
      if(commands){
        this.botCommandsList = commands.value.join(',')
      }
      const dtr = Configs.findOne("botDefaultThread");
      if(dtr){
        this.chatThreadId = dtr.value
      }
    }
  },
  methods: {
    createBot() {
      Meteor.call('adminClientCreateBot', this.botUsername, (error, result) => {
        if(error){
          console.log(error);
          this.commandsResult = JSON.stringify(error) ;
          return;
        }
        console.log('Result:', result);
        this.commandsResult = JSON.stringify(result);

      });
    },
    defineBotCommands() {
      Meteor.call('adminClientSetBotCommands', this.botCommandsList.trim().split(','), (error, result) => {
        if(error){
          console.log(error);
          this.commandsResult = JSON.stringify(error) ;
          return;
        }
        console.log('Result:', result);
        this.commandsResult = JSON.stringify(result);
      })
    },
    addBotToThread(){
      Meteor.call('adminClientAddBotToThread', this.chatThreadId, (error, result) => {
        if(error){
          console.log(error);
          this.commandsResult = JSON.stringify(error) ;
          return;
        }
        console.log('Result:', result);
        this.commandsResult = JSON.stringify(result);
      })
    }
  },
  mounted() {
    if(this.adminClientStatus) {
      const adminClientProfile = Configs.findOne('adminClientProfile')
      if(adminClientProfile)
        console.log('Admin Profile', adminClientProfile.value);
    }

    this.loadDefaultValues;
  },
}
</script>

<style scoped>

</style>

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
              <v-text-field v-model="botUsername"></v-text-field>
            </td>
          </tr>

          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <v-card
        v-if="botCreateResult"

        style="direction: ltr !important;"
        class="mt-4">
      BOT INFO:
      <div >{{botCreateResult}}</div>
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
    botCreateResult: null
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
  },
  methods: {
    createBot() {
      Meteor.call('adminClientCreateBot', this.botUsername, (error, result) => {
        if(error){
          console.log(error);
          this.botCreateResult = JSON.stringify(error) ;
          return;
        }
        console.log('Bot Profile', result);
        this.botCreateResult = JSON.stringify(result);

      });
    }
  },
  mounted() {
    if(this.adminClientStatus) {
      const adminClientProfile = Configs.findOne('adminClientProfile')
      if(adminClientProfile)
        console.log('Admin Profile', adminClientProfile.value);
    }
  },
}
</script>

<style scoped>

</style>

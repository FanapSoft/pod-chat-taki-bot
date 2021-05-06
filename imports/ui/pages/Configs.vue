<template>
  <v-container>
    <v-card>
      <v-card-subtitle v-if="message || error">
        <span
            v-if="message"

            class="green--text">{{message}}</span>
        <span
            v-else

            class="error--text">{{error}}</span>
      </v-card-subtitle>
      <v-simple-table>
        <template v-slot:default>
          <tbody v-if="configs">
          <tr>
            <th>اطلاعات ربات</th>
            <td>
              <div><v-text-field v-model="botToken" label="توکن"></v-text-field></div>
              <div><v-text-field v-model="botUsername" label="نام کاربری (یوزرنیم)"></v-text-field></div>
            </td>
          </tr>
          <tr>
            <th>توکن ادمین</th>
            <td>
              <v-text-field v-model="adminToken"></v-text-field>
            </td>
          </tr>
          <tr >
            <th>فاصله زمانی بین سوالات</th>
            <td>
              <v-row>
                <v-col cols="3">
                  <v-switch v-model="questionsDelayEnabled"></v-switch>
                </v-col>
                <v-col v-if="questionsDelayEnabled" cols="9">
                  <v-text-field v-model="questionsDelaySeconds"></v-text-field>
                </v-col>
              </v-row>
            </td>
          </tr>
          <tr >
            <th>فعال بودن ربات </th>
            <td>
              <v-switch v-model="botActive">آیا ربات به کاربران پاسخ بدهد ؟</v-switch>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-card-actions>
        <v-btn @click="save">ذخیره</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mt-4">
      <v-simple-table>
        <template v-slot:default>
          <tbody v-if="configs">
          <tr >
            <th>روشن کردن کلاینت ربات </th>
            <td v-if="botClientStatus">
              <v-switch v-model="botClientIsActive"></v-switch>
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
            </td>
          </tr>
          <tr >
            <th>روشن کردن کلاینت ادمین </th>
            <td>
              <v-switch v-model="adminClientIsActive"></v-switch>
              <div>
                  <span
                      v-if="adminClientStatus.active"

                      class="green--text">کلاینت ادمین فعال است</span>
                <span
                    v-else

                    class="red--text">کلاینت ادمین غیرفعال است</span>
              </div>
              <div>
                <span class="red--text">خطا: </span>
                <span v-if="adminClientStatus.error" class="red--text">{{adminClientStatus.error}}</span>
                <span v-else>خطایی نیست</span>
              </div>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import Configs from "../../api/collections/Configs"
export default {
  name: "Configs",
  data:()=>({
    configs: null,
    message: '',
    error: '',
    botClientCollection: null,
  }),
  created() {
    //this.botClientCollection = new Mongo.Collection('botClientStatus')
    //used $subscribe instead
    //const handle = Meteor.subscribe("botClientStatus");
  },
  meteor: {
    $subscribe: {
      'Configs': [],
    },
/*    configs(){
      return Configs.find({})
    },*/
    botClientStatus() {
      const res = Configs.findOne('botClientStatus');
      return res ? res.value : {};
    },
    adminClientStatus() {
      const res = Configs.findOne('adminClientStatus');
      return res ? res.value : {};
    },
  },
  computed: {
    botToken: {
      get() {
          return this.configs ? this.configs.find(i => i._id === 'botToken').value : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item._id === 'botToken') {
            item.value = val;
            item.hasChanges = true;
          }
        })
      }
    },
    botUsername: {
      get() {
          return this.configs ? this.configs.find(i => i._id === 'botUsername').value : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item._id === 'botUsername') {
            item.value = val;
            item.hasChanges = true;
          }
        })
      }
    },

    adminToken: {
      get() {
          return this.configs ? this.configs.find(i => i._id === 'adminToken').value : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item._id === 'adminToken') {
            item.value = val;
            item.hasChanges = true;
          }
        })
      }
    },
    questionsDelaySeconds: {
      get() {
        return this.configs ? this.configs.find(i => i._id === 'questionsDelayInSecond').value.seconds : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item._id === 'questionsDelayInSecond') {
            item.value.seconds = val;
            item.hasChanges = true;
          }
        })
      }
    },
    questionsDelayEnabled: {
      get() {
        return this.configs ? this.configs.find(i => i._id === 'questionsDelayInSecond').value.enabled : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item._id === 'questionsDelayInSecond') {
            item.value.enabled = val;
            item.hasChanges = true;
          }
        })
      }
    },
    botActive: {
      get() {
        return this.configs ? this.configs.find(i => i._id === 'botActive').value : false;
      },
      set(val) {
        this.configs.forEach(item => {
          if(item._id === 'botActive') {
            item.value = val;
            item.hasChanges = true;
          }
        })
      }
    },
    botClientIsActive: {
      get() {
        if(this.botClientStatus) {
          return this.botClientStatus.active
        }
      },
      set() {
        this.toggleBotClientStatus()
      }
    },
    adminClientIsActive: {
      get() {
        if(this.adminClientStatus) {
          return this.adminClientStatus.active
        }
      },
      set() {
        this.toggleAdminClientStatus()
      }
    },

  },
  methods: {
    resetMessages(){
      this.message = null;
      this.error = null;
    },
    initialize() {
      this.resetMessages()
      Meteor.call('configList', (error, result) => {
        if(error){
          console.log(error)
        }

        this.configs = result;
      })
    },
    toggleBotClientStatus() {
      Meteor.call('toggleBotClient')
    },
    toggleAdminClientStatus() {
      Meteor.call('toggleAdminClient')
    },

    save() {
      this.configs.forEach(item => {
        if(item.hasChanges) {
          this.update(item)
        }
      })
    },
    update(item) {
      Meteor.call('configUpdate', item._id, item.value, (error, result) => {
        if(error) {
          console.log(error);
          this.error = error.reason ? error.reason : 'خطا: کنسول را بررسی کنید'
        } else {
          this.message = 'تغییرات ذخیره شد.'
        }
      });
    },
  },
  mounted() {
    this.initialize();
  },
}
</script>

<style scoped>

</style>

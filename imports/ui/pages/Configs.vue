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
            <th>توکن ربات</th>
            <td>
              <v-text-field v-model="botToken"></v-text-field>
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
            <th>فعال بودن ربات</th>
            <td>
              <v-switch v-model="botActive"></v-switch>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-card-actions>
        <v-btn @click="save">ذخیره</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Configs",
  data:()=>({
    configs: null,
    message: '',
    error: '',
  }),
  computed: {
    botToken: {
      get() {
          return this.configs ? this.configs.find(i => i.name === 'botToken').value : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item.name === 'botToken') {
            item.value = val;
            item.hasChanges = true;
          }
        })
      }
    },
    questionsDelaySeconds: {
      get() {
        return this.configs ? this.configs.find(i => i.name === 'questionsDelayInSecond').value.seconds : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item.name === 'questionsDelayInSecond') {
            item.value.seconds = val;
            item.hasChanges = true;
          }
        })
      }
    },
    questionsDelayEnabled: {
      get() {
        return this.configs ? this.configs.find(i => i.name === 'questionsDelayInSecond').value.enabled : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item.name === 'questionsDelayInSecond') {
            item.value.enabled = val;
            item.hasChanges = true;
          }
        })
      }
    },
    botActive: {
      get() {
        return this.configs ? this.configs.find(i => i.name === 'botActive').value : false
      },
      set(val) {
        this.configs.forEach(item => {
          if(item.name === 'botActive') {
            item.value = val;
            item.hasChanges = true;
          }
        })
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
    }
  },
  mounted() {
    this.initialize();
  }
}
</script>

<style scoped>

</style>

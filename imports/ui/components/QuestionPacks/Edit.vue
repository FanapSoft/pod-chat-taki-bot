<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon
          v-bind="attrs"
          v-on="on"

          size="20">mdi-pencil</v-icon>
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
              <v-text-field
                  v-model="item.title"
                  label="عنوان پک"
              ></v-text-field>
            </v-col>
            <v-col
                cols="12"
            >
              <jalali-date-picker
                  clearable

                  v-model="item.startsAt"

                  :locale-config="{
                      fa: {
                        displayFormat: 'jYYYY/jMM/jDD HH:mm:ss',
                        lang: { label: 'شمسی' }
                      },
                      en: {
                        displayFormat: 'YYYY/MM/DD HH:mm:ss',
                        lang: { label: 'Gregorian' }
                      }
                    }"
                  :editable="true"

                  display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                  type="datetime"

                  locale="fa"
                  placeholder="تاریخ شروع"
              ></jalali-date-picker>
            </v-col>
            <v-col
                cols="12"
            >
              <jalali-date-picker
                  clearable

                  v-model="item.endsAt"

                  :locale-config="{
                      fa: {
                        displayFormat: 'jYYYY/jMM/jDD HH:mm:ss',
                        lang: { label: 'شمسی' }
                      }
                    }"
                  :editable="true"

                  type="datetime"
                  placeholder="تاریخ پایان"
                  display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                  locale="fa"
              ></jalali-date-picker>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.duration"
                  label="duration"
              ></v-text-field>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-text-field
                  v-model="item.threshold"
                  label=" threshold"
              ></v-text-field>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4"
            >
              <v-select
                  v-model="item.status"

                  :items="[
                      {
                        text: 'تمام شده',
                        value: 2
                      },
                      {
                        text: 'شروع شده ',
                        value: 1
                      },
                      {
                        text: 'شروع خواهد شد',
                        value: 3
                      },

                  ]"

                  item-text="text"
                  item-value="value"
                  label="وضعیت پک">
              </v-select>
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
  name: "EditQuestionPack",
  props: {
    pack: null
  },
  data: () => ({
    dialog: false,
    message: '',
    error: '',
    item: {
      title: null,
      startsAt: null,
      endsAt: null,
      duration: 10,
      threshold: 50,
      status: 3
    }
  }),
  methods: {
    save() {
      this.resetMessages();

      Meteor.call('questionPackUpdate', this.item, (error, result) => {
        if (error) {
          console.log(error);
          this.error = error.reason ? error.reason : 'خطا: کنسول را بررسی کنید';
        } else {
          this.message = ' ایجاد شد.';
          this.$emit('updateList');
        }
      });
      this.dialog = false;
    },
    reset() {
      this.dialog = false;
      this.resetMessages();
      this.item = {
        title: null,
        startsAt: null,
        endsAt: null,
        duration: 10,
        threshold: 50,
        status: 3
      }
    },
    resetMessages() {
      this.message = '';
      this.error = '';
    }
  },
  mounted() {
    this.$set(this, 'item' , this.pack);
  }
}
</script>

<style scoped>

</style>

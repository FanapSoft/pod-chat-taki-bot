<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="primary"
          dark
          class="mb-2"
          v-bind="attrs"
          v-on="on"
      >
        آیتم جدید
      </v-btn>
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
              <v-text-field
                  v-model="startsAt"

                  dir="ltr"
                  id="startsAt-input">
                <template v-slot:append>
                  <v-btn
                      @click="startsAtVisibility=true" depressed><v-icon>mdi-calendar</v-icon></v-btn>
                </template>
              </v-text-field>
              <jalali-date-picker
                  v-model="startsAt"

                  :show="startsAtVisibility"
                  @click="startsAtVisibility = true"

                  type="datetime"
                  format="Y/M/D HH:mm:ss"
                  display-format="jYYYY/jMM/jDD HH:mm:ss"
                  placeholder="تاریخ شروع"
                  element="startsAt-input"
              ></jalali-date-picker>
            </v-col>
            <v-col
                cols="12"
            >
              <v-text-field
                  v-model="endsAt"

                  dir="ltr"
                  id="endsAt-input">
                <template v-slot:append>
                  <v-btn @click="endsAtVisibility=true" depressed><v-icon>mdi-calendar</v-icon></v-btn>
                </template>
              </v-text-field>
              <jalali-date-picker
                  v-model="endsAt"

                  type="datetime"
                  format="Y/M/D HH:mm:ss"
                  placeholder="تاریخ پایان"
                  element="endsAt-input"
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
  name: "AddQuestionPack",
  data: () => ({
    dialog: false,
    message: null,
    error: null,
    item: {
      title: null,
      startsAt: null,
      endsAt: null,
      duration: 10,
      threshold: 50,
      status: 3
    },
    startsAt: null,
    endsAt: null,
    startsAtVisibility: false,
    endsAtVisibility: false,
  }),
  methods: {
    save() {
      this.resetMessages();

      this.item.startsAt = new Date(this.startsAt);
      this.item.endsAt = new Date(this.endsAt);

      Meteor.call('questionPackCreate', {...this.item, startsAt: new Date(this.item.startsAt), endsAt: new Date(this.item.endsAt)}, (error, result) => {
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
  }
}
</script>

<style scoped>

</style>

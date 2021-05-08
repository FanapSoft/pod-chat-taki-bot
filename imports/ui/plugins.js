import Vue from 'vue'

import VueMeteorTracker from 'vue-meteor-tracker'
Vue.use(VueMeteorTracker);

export vuetify from './vuetify'

export store from './store';
export router from './router';

import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
Vue.component('jalali-date-picker', VuePersianDatetimePicker);

import Vue from 'vue'

import { router, store, vuetify } from "../imports/ui/plugins";

import App from '../imports/ui/App.vue'

Meteor.startup(() => {
  new Vue({
    el: '#app',
    store,
    router,
    vuetify,
    ...App,
  })
});

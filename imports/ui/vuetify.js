import Vue from 'vue'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify); // this is all you need for Vuetify

export default new Vuetify({
    rtl: true,
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                primary: "#5867dd",
                secondary: "#e8ecfa",
                accent: "#5d78ff",
                error: "#fd397a",
                info: "#5578eb",
                success: "#0abb87",
                warning: "#ffb822"
            }
        }
    }
})

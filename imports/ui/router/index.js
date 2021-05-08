import Vue from "vue";
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
    mode: 'history',
    base: process.env.NODE_ENV === 'production' ? '/admin' : '',
    routes: [
        {
            path: "/",
            redirect: "/dashboard",
            component: () => import("../layouts/Main"),
            beforeEnter(to, from, next){
                if(Meteor.loggingIn()) {
                    setTimeout(()=> {
                        next(to.path)
                    }, 500)
                }
                else if( Meteor.user()) {
                    next();
                } else {
                    next("/login")
                }
            },
            children: [
                {
                    path: "/dashboard",
                    component: () => import("../pages/Dashboard"),
                },
                {
                    path: "/admins",
                    component: () => import("../pages/Admins"),
                },
                {
                    path: "/configs",
                    component: () => import("../pages/Configs"),
                },
                {
                    path: "/manageAdminAccount",
                    component: () => import("../pages/ManageAdminClient"),
                },
                {
                    path: "/questions",
                    component: () => import("../pages/QuestionPacks"),
                },

            ]
        },
        {
            name: "Login",
            path: "/login",
            component: () => import("../pages/Login"),
        },

    ]
})

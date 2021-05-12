<template>
  <div style="height: 100%" >
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer">

      </v-app-bar-nav-icon>
      <v-toolbar-title>منو</v-toolbar-title>
      <v-spacer></v-spacer>
      <a @click="logout">خروج</a>
    </v-app-bar>
    <v-navigation-drawer
        app right temporary

        v-model="drawer">
      <v-list
          dense nav
      >
        <v-list-item
            v-for="item in menuItems"

            link

            :key="item.title"
            :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main
        app
style="min-height: 100%"
        class="blue lighten-5">
        <router-view />
    </v-main>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      drawer: false,
      menuItems: [
        {
          title: 'داشبورد',
          icon: 'mdi-view-dashboard',
          link: '/dashboard'
        },
        {
          title: 'پک های سوالات',
          icon: 'mdi-view-dashboard',
          link: '/questionPacks'
        },
        {
          title: 'سوالات',
          icon: 'mdi-view-dashboard',
          link: '/questions'
        },
        {
          title: 'کاربران',
          icon: 'mdi-view-dashboard',
          link: '/talkUsers'
        },
        {
          title: 'مدیران',
          icon: 'mdi-view-dashboard',
          link: '/admins'
        },
        {
          title: 'تنظیمات کلی سیستم',
          icon: 'mdi-view-dashboard',
          link: '/configs'
        },
        {
          title: 'مدیریت اکانت ادمین',
          icon: 'mdi-view-dashboard',
          link: '/manageAdminAccount'
        },
      ]
    }
  },
  methods: {
    logout() {
      Meteor.logout();
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
</style>

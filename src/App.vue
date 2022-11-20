<template>
  <v-app style="{background: $vuetify.theme.dark.background}">

    <!-- <NavDrawer></NavDrawer> -->

    <NavBar></NavBar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <v-alert width="20%" dismissible elevation="1" :type="alert.type" :color="alert.color"
        transition="slide-y-transition" style="position: absolute; right: 5%; top: 2%; z-index:20001;"
        v-model="alert.show" class="text-button">
        {{ alert.msg }}
      </v-alert>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <NavFooter></NavFooter>
    </v-footer>
  </v-app>
</template>
<script>
import styles from '../app.css'
import NavBar from '@/components/NavBar.vue';
// import NavDrawer from './components/NavDrawer.vue';
import NavFooter from './components/NavFooter.vue';
import { EventBus } from '@/main';
import { mixins } from '@/mixins.js';
export default {
  mixins: [mixins],
  components: {
    NavBar,
    NavFooter
  },
  name: 'App',
  data: () => ({
    alert: {
      show: false,
      color: "",
      type: null,
      msg: ""
    }
  }),
  computed: {
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },
  created() {
    EventBus.$on('showAlert', model => {
      this.showAlert(model);
    })
    EventBus.$on('countdown', model => {
      this.countdown(model);
    })
    if (this.isSessionSetted()) {
      
    }
  },
  methods: {
    showAlert(model) {
      this.alert = {
        color: model.color,
        type: model.type,
        msg: model.msg,
        show: true
      }
      setTimeout(() => this.alert.show = false, 2200);
    },
    countdown(model) {
      this.alert = {
        color: model.color,
        type: model.type,
        msg: model.msg,
        show: true
      }
      if (model.count == "count_0") setTimeout(() => this.alert.show = false, 500);
    }
  }
}
</script>
<style>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: #5c5c5c;
}

::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.6);
}

.background-color {
  height: 100vh;
  width: 100vw;
  background-color: var(--generala-bg);
}
</style>
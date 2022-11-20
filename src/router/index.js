import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ConfigureLobby from '../views/ConfigureLobby.vue';
import LobbyRoom from '../views/LobbyRoom.vue';
import GameUI from '../views/GameUI.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: {
      inLobby: true
    }
  },
  {
    path: '/lobby/cfg/:lobbyId',
    component: ConfigureLobby,
    meta: {
      needsAuth: true
    }
  },
  {
    path: '/lobby/:lobbyId',
    component: LobbyRoom,
    meta: {
      needsAuth: true
    }
  },
  {
    path: '/game',
    component: GameUI,
    // meta: {
    //   inLobby: true
    // }
  },
  {
    path: '/*',
    component: HomeView,
    meta: {
      inLobby: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const ls = JSON.parse(localStorage.getItem("generalanet_session"));
  if (to.meta.inLobby && ls != null){
    if (ls.lobbyId) next("/lobby/"+ls.lobbyId);
  }
  if (to.meta.needsAuth){
    if (ls != null && ls['tokenPayload'].accessToken && ls['tokenPayload'].refreshToken) next();
    else next("/");
  }
  next();
});

export default router

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios);

const BASE_URL = 'http://localhost:9876'

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(
  async config => {
    const ls = JSON.parse(localStorage.getItem('generalanet_session'));

    if (ls){
      config.headers = { 
        'Authorization': `Bearer ${ls['tokenPayload'].accessToken}`,
        'Accept': 'application/json',
      }
    } else {
      config.headers = { 
        'Accept': 'application/json',
      }
    }

    return config;
  },
  error => {
    Promise.reject(error)
});

axios.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const refresh = await refreshAccessToken();
    let ls = JSON.parse(localStorage.getItem('generalanet_session'));
    ls['tokenPayload'].accessToken = refresh.accessToken;
    localStorage.setItem("generalanet_session", JSON.stringify(ls));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + refresh.accessToken;
    return axios(originalRequest);
  }
  return Promise.reject(error);
});

async function refreshAccessToken() {

  const refreshToken = JSON.parse(localStorage.getItem('generalanet_session'))['tokenPayload'].refreshToken;

  const res = await fetch(BASE_URL+'/api/auth/new/access-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken : refreshToken })
  })
    .then((response) => response.json())

  return res;
}

Vue.config.productionTip = false

export const EventBus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    timeLimit: {
      SEC_30: {
        str: "30 Seconds",
        num: 1
      },
      SEC_60: {
        str: "60 Seconds",
        num: 2
      },
      SEC_90: {
        str: "90 Seconds",
        num: 3
      },
      SEC_120: {
        str: "120 Seconds",
        num: 4
      },
      NO_LIMIT: {
        str: "Without time limit",
        num: 0
      }
    },
  },
    getters: {
      getTimeLimit(state){
        return state.timeLimit;
      },
      getTimeLimitByEnum: (state) => (javaEnum) => {
        return state.timeLimit[javaEnum].str;
      },
      getTimeLimitNumByStr: (state) => (str) => {
        return Object.keys(state.timeLimit)
          .find(key => state.timeLimit[key]['str'] == str);
      }
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    }
  }
);


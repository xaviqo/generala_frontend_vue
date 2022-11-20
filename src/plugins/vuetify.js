import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

// https://coolors.co/palette/29bf12-abff4f-08bdbd-f21b3f-ff9914

export default new Vuetify({
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            dark: {
                primary: '#08BDBD',
                secondary: '#ABFF4F',
                error: '#F21B3F',
                info: '#08BDBD',
                success: '#29BF12',
                warning: '#FF9914',
                background: '#1E1E1E',
                background1: '#363636',
                background2: '#272727'
            },
            light: {
                primary: '#08BDBD',
                secondary: '#ABFF4F',
                error: '#F21B3F',
                info: '#08BDBD',
                success: '#29BF12',
                warning: '#FF9914',
                background: '#1E1E1E',
                background1: '#363636',
                background2: '#272727'
            },
        },
    },
});
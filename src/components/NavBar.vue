<template>
    <v-app-bar dark elevation="1" app>
        <v-app-bar-nav-icon @click="changeDrawerStatus()">
        </v-app-bar-nav-icon>
        <v-app-bar-title>
            <div class="mb-1">
                <span class="animate-logo">GENERALA</span>
            <v-icon class="animate-logo mr-2" style="transform: scale(.7)">mdi-dice-5</v-icon>
                <span class="animate-logo">NET</span>
            </div>
        </v-app-bar-title>
    </v-app-bar>
</template>

<style>
.animate-logo {
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background-image: linear-gradient(-225deg,
            #29bf12ff 0%,
            #08bdbdff 29%,
            #ff9914ff 67%,
            #abff4fff 100%);
    background-size: auto auto;
    background-clip: border-box;
    background-size: 150% auto;
    color: #fff;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textclip 2s alternate infinite;
    display: inline-block;
    font-size: 2em;
    text-shadow: 1px 1px 2px rgb(255, 255, 255, .8);
}

@keyframes textclip {
    to {
        background-position: 100% center;
    }
}
</style>
<script>
import { EventBus } from '@/main';
export default {
    name: 'NavBar',
    components: {
    },
    data: () => ({
    }),
    methods: {
        changeDrawerStatus() {
            EventBus.$emit('NavDrawer_changeDrawerStatus');
        }
    }
}
</script>
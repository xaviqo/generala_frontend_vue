<template>
    <v-container>
        <v-row justify="center">
            <v-card dark height="20vh" width="40vw" class="mt-10" elevation="0">
                <div class="centerForm">
                    <div></div>
                    <div class="mt-4">
                        <v-form ref="createGameForm" v-model="validNew" lazy-validation>
                            <v-text-field dense prepend-inner-icon="mdi-account" outlined hint="Nickname"
                                v-model="user.nickname" :rules="rules.name" required>
                            </v-text-field>
                            <v-row class="justify-center">
                                <v-btn color="success" class="mr-4 mt-2" tile elevation="1" @click="createGame()">
                                    New Game
                                </v-btn>
                            </v-row>
                        </v-form>
                    </div>
                    <div></div>
                </div>
            </v-card>
        </v-row>
        <v-row justify="center">
            <v-card dark height="20vh" width="40vw" elevation="0">
                <div class="centerForm">
                    <div></div>
                    <div class="mt-4">
                        <v-form ref="enterCodeForm" v-model="validEnter" lazy-validation>
                            <v-text-field dense prepend-inner-icon="mdi-account" outlined hint="Nickname"
                                v-model="game.nickname" :rules="rules.name" required>
                            </v-text-field>
                            <v-text-field dense prepend-inner-icon="mdi-account" outlined hint="Game Code"
                                v-model="game.code" :rules="rules.code" required>
                            </v-text-field>
                            <v-row class="justify-center">
                                <v-btn color="info" class="mr-4 mt-2" tile elevation="1" @click="enterGame()">
                                    Enter Code
                                </v-btn>
                            </v-row>
                        </v-form>
                    </div>
                    <div></div>
                </div>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
import { EventBus } from '@/main';
import { mixins } from '@/mixins';
export default {
    mixins: [mixins],
    components: {
    },
    data: () => ({
        validNew: true,
        validEnter: true,
        user: {
            nickname: "",
        },
        game: {
            nickname: "",
            code: ""
        },
        rules: {
            code: [
                v => !!v || 'Game code is required',
                v => !(v.length != 8) || 'Game code must be 8 characters long',
            ],
            name: [
                v => !!v || 'Nickname is required',
                v => !(v && v.length > 14) || 'Nickname must be less than 14 characters',
                v => !(v && v.length < 4) || 'Nickname must be at least 4 characters',
            ]
        }
    }),
    created() {

    },
    methods: {
        createGame() {
            if (this.validateFormCreateGame()) {
                this.axios
                    .post(`/api/lobby/new/${this.user.nickname}`)
                    .then((res) => {
                        if (res.status === 201) {
                            this.removeSession();
                            this.saveSession(res.data);
                            EventBus.$emit('showAlert', {
                                color: "success",
                                type: "success",
                                msg: `Welcome ${res.data.nickname}! Configure your new lobby`
                            });
                            this.$router.push(`/lobby/cfg/${this.retrieveLobbyId()}`);
                        }
                    })
                    .catch((e) => {
                        EventBus.$emit('showAlert', {
                                color: "error",
                                type: "error",
                                msg: `Error ${e.response.data.code}. ${e.response.data.message}`
                            });
                        this.resetFormCreateGame();
                    });
            } else {
                EventBus.$emit('showAlert', {
                    color: "error",
                    type: "error",
                    msg: "Please, enter a nickname"
                });
            }
        },
        enterGame(){
            if (this.validateFormEnterGame()) {
                this.axios
                    .post(`/api/lobby/join/${this.game.code}/${this.game.nickname}`)
                    .then((res) => {
                        if (res.status === 201) {
                            this.removeSession();
                            this.saveSession(res.data);
                            EventBus.$emit('showAlert', {
                                color: "success",
                                type: "success",
                                msg: `Welcome ${res.data.nickname}!`
                            });
                            this.$router.push(`/lobby/${this.retrieveLobbyId()}`);
                        }
                    })
                    .catch((e) => {
                        EventBus.$emit('showAlert', {
                                color: "error",
                                type: "error",
                                msg: `Error ${e.response.data.code}. ${e.response.data.message}`
                            });
                        this.resetFormEnterGame();
                    });
            } else {
                EventBus.$emit('showAlert', {
                    color: "error",
                    type: "error",
                    msg: "Please, enter a nickname and game code"
                });
            }
        }, 
        resetFormCreateGame() {
            this.$refs.createGameForm.reset()
        },
        validateFormCreateGame() {
            return this.$refs.createGameForm.validate()
        },
        resetFormEnterGame(){
            this.$refs.enterCodeForm.reset()
        },
        validateFormEnterGame(){
            return this.$refs.enterCodeForm.validate();
        }
    },
}
</script>
<style>
.centerForm {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
}
</style>
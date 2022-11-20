<template>
    <v-row justify="center">
        <v-card dark elevation="0">
            <div class="pa-15">
                <div class="gameCodeDiv" v-if="created">
                    <v-card elevation="0" color="lightBg">
                        <v-card-title>This is your game code. Share it with your friends to play together!</v-card-title>
                        <v-text-field
                            label="Game code"
                            :value="gameId"
                            outlined
                            readonly
                        ></v-text-field>
                        <v-btn color="success" class="mr-4" @click="goLobby()">
                            Go to Lobby
                        </v-btn>
                    </v-card>
                </div>
                <v-form ref="createGameForm" v-model="valid" lazy-validation v-if="!created" dark>
                    <v-select v-model="createGameForm.maxPlayers" :items="numOfPlayersSelect"
                        :rules="[v => !!v || 'Indicate number of players']" label="Max Players" required
                        outlined></v-select>
    
                    <v-select v-model="createGameForm.timeRule" :items="timeRuleSelect"
                        :rules="[v => !!v || 'Indicate a time rule']" label="Time Rule" required
                        outlined></v-select>
    
                    <v-select v-model="createGameForm.openToEveryone" :items="openGame"
                        :rules="[v => !!v || 'Indicate game protection']" label="Open or protected" required
                        outlined></v-select>
    
                    <div v-if="createGameForm.openToEveryone == 'Private game'">
                        <v-text-field v-model="createGameForm.password" :counter="10" :rules="rules.pass" label="Password"
                            background-color="brownie" required outlined></v-text-field>
                    </div>
                </v-form>
                <div>
                    <v-btn color="success" class="mr-4" @click="createNewGame()" v-if="!created">
                        Create Game
                    </v-btn>
    
                    <v-btn color="error" class="mr-4" @click="resetForm()" v-if="!created">
                        Reset Form
                    </v-btn>
    
                    <v-btn color="info" class="mr-4" @click="goBack()">
                        Go back
                    </v-btn>
                </div>
            </div>
        </v-card>
    </v-row>
</template>
<script>
import { EventBus } from '@/main';
import { mixins } from '@/mixins';
export default {
    mixins: [mixins],
    data: () => ({
        valid: true,
        createGameForm: {
            maxPlayers: null,
            timeRule: null,
            openToEveryone: false,
            password: null
        },
        openGame: ['Open to everyone', 'Private game'],
        numOfPlayersSelect: ["2 Players", "3 Players", "4 Players"],
        timeRuleSelect: [],
        rules: {
            pass: [
                v => !!v || 'Password is required',
                v => (v && v.length <= 12) || 'Password must be less than 12 characters',
                v => (v && v.length >= 4) || 'Password must be at least 4 characters',
            ]
        },
        gameDto: {
            maxPlayers: 0,
            timeRule: 0,
            openToEveryone: false,
            password: ""
        },
        created: false,
        gameId: ""
    }),
    computed: {
        timeLimits(){
            return this.$store.getters.getTimeLimit;
        }
    },
    created() {
        if (!this.lobbiesMatch()) {
            EventBus.$emit('showAlert', {
                color: "error",
                type: "error",
                msg: `Wrong Lobby! You cannot access this game. Please, create a new one.`
            });
            this.$router.push(`/`);
        }
        Object.values(this.timeLimits).forEach(tl =>
            this.timeRuleSelect.push(tl.str)
        );
    },
    methods: {
        createNewGame() {
            this.gameDto = this.formToDto(this.createGameForm);
            this.axios
                .put(`/api/game/cfg/${this.retrieveLobbyId()}`, this.gameDto)
                .then((res) => {
                    if (res.status === 200) {
                        EventBus.$emit('showAlert', {
                            color: "success",
                            type: "success",
                            msg: `New lobby successfully created`
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
                    if (e.response.data.code == "006"){
                        this.$router.push(`/lobby/${this.retrieveLobbyId()}`);
                    }
                });
        },
        formToDto(form) {
            const dto = {};
            dto.maxPlayers = form.maxPlayers.substring(0, 1);
            dto.timeRule = this.$store.getters.getTimeLimitNumByStr(form.timeRule);
            dto.openToEveryone = (form.openToEveryone == 'Open to everyone');
            if (!dto.openToEveryone) {
                dto.password = form.password
            } else {
                dto.password = "";
            }
            return dto;
        },
        parseTimeRule(timerule) {
            switch (timerule) {
                case this.timeRuleSelect[0]:
                    return 1;
                case this.timeRuleSelect[1]:
                    return 2;
                case this.timeRuleSelect[2]:
                    return 3;
                case this.timeRuleSelect[3]:
                    return 4;
                default:
                    return 0;
            }
        },
        resetForm() {
            this.$refs.createGameForm.reset()
        },
        goBack() {
            this.$router.push('/');
        },
        lobbiesMatch() {
            return (this.$route.params.lobbyId.toUpperCase() == this.retrieveLobbyId().toUpperCase());
        },
    },
}
</script>
<style>
.gameCodeDiv{
    width: 550px;
}
</style>
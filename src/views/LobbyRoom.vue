<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="4">
                <v-card class="mx-auto" elevation="0" dark height="60vh" color="background1">
                    <v-list color="background1">
                        <v-list-item dense class="infoList mt-n1">
                            <v-list-item-icon>
                                <v-icon>mdi-information</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="text-button">Lobby Info</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-information-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Lobby Id</v-list-item-title>
                            <v-list-item-subtitle>{{ $route.params.lobbyId }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-crown</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Game Admin</v-list-item-title>
                            <v-list-item-subtitle v-if="isAdmin()" class="font-weight-bold">{{ lobbyInfo.gameAdmin }} (You)</v-list-item-subtitle>
                            <v-list-item-subtitle v-else >{{ lobbyInfo.gameAdmin }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item v-if="!isAdmin()">
                            <v-list-item-icon>
                                <v-icon>mdi-account</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Your nickname</v-list-item-title>
                            <v-list-item-subtitle class="font-weight-bold">{{ myNickname }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-timer-sand</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Time Rule</v-list-item-title>
                            <v-list-item-subtitle>{{ lobbyInfo.timeRuleString }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-account-multiple-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Lobby Size</v-list-item-title>
                            <v-list-item-subtitle>{{ lobbyInfo.maxPlayers }} players max.</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-lock</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Lobby Type</v-list-item-title>
                            <v-list-item-subtitle>{{ lobbyInfo.openToEveryone ? 'Open to everyone' : 'Password protected' }}
                            </v-list-item-subtitle>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item dense class="infoList">
                            <v-list-item-icon>
                                <v-icon>mdi-account-group</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="text-button">Players</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item v-for="player, id in idsAndPlayers" :key="id">
                            <v-list-item-icon v-if="isPlayerIdInConnectedPlayers(id)">
                                <v-icon color="success">mdi-account-badge</v-icon>
                            </v-list-item-icon>
                            <v-list-item-icon v-else>
                                <v-icon color="error">mdi-account-cancel</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                {{ player }}
                            </v-list-item-title>
                            <v-list-item-subtitle v-if="nameItsMe(player) && isAdmin()">
                                <v-btn
                                elevation="2"
                                x-small
                                color="warning"
                                class="black--text"
                                @click="deleteLobby()"
                                >
                                Delete Lobby
                                </v-btn>
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="!nameItsMe(player) && isAdmin()">
                                <v-btn
                                elevation="2"
                                x-small
                                color="error"
                                @click="kickPlayer(id)"
                                >
                                Kick Player
                                </v-btn>
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="nameItsMe(player) && !isAdmin()">
                                <v-btn
                                elevation="2"
                                x-small
                                color="warning"
                                class="black--text"
                                @click="leaveLobby()"
                                >
                                Leave Lobby
                                </v-btn>
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="6">
                <LobbyChat></LobbyChat>
            </v-col>
        </v-row>
        <v-row justify="center" class="mt-10">
            <v-btn color="info" class="mr-4" @click="goBack()">
                Go Back
            </v-btn>
            <v-btn v-if="isAdmin()" color="success" class="mr-4" @click="startGame()">
                Start Game
            </v-btn>
        </v-row>
    </v-container>
</template>
<script>
import LobbyChat from '@/components/lobby/LobbyChat'
import { EventBus } from '@/main';
import { mixins } from '@/mixins';
export default {
    mixins: [mixins],
    components: {
        LobbyChat
    },
    data: () => ({
        myNickname: "",
        lobbyInfo: {
        },
        idsAndPlayers: null,
        connectedPlayersIds: []
    }),
    computed: {
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
        this.myNickname = this.retrieveNickname();
        this.retrieveGameConfiguration();
        this.connectedPlayersIds.push(this.retrievePlayerId());
        EventBus.$on('lobbyRoom_playersStatus', body => {
            this.retrieveGameConfiguration(),
            this.manageConnectedPlayers(body)
        });
    },
    methods: {
        retrieveGameConfiguration() {
            this.axios
                .get(`/api/game/cfg/${this.retrieveLobbyId()}`)
                .then((res) => {
                    this.lobbyInfo = res.data;
                    this.idsAndPlayers = res.data.idsAndPlayers;
                    this.lobbyInfo.timeRuleString = this.$store.getters.getTimeLimitByEnum(this.lobbyInfo.timeRule);
                    res.data.alreadyConnectedPlayers.forEach(id => {
                        this.manageConnectedPlayers({
                            interaction: 'JOIN',
                            senderId: id
                        });
                    });
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
        startGame(){
            this.axios
                .post(`/api/lobby/start`)
                .catch((e) => {
                    EventBus.$emit('showAlert', {
                        color: "error",
                        type: "error",
                        msg: `Error ${e.response.data.code}. ${e.response.data.message}`
                    });
                });
        },
        kickPlayer(idToKick){
            this.axios
                .post(`/api/lobby/kick`,{
                    lobbyId: this.retrieveLobbyId(),
                    playerToKickId: idToKick
                })
                .catch((e) => {
                    EventBus.$emit('showAlert', {
                        color: "error",
                        type: "error",
                        msg: `Error ${e.response.data.code}. ${e.response.data.message}`
                    });
                });
        },
        leaveLobby(){
            EventBus.$emit('lobbyChat_disconnectWs');
            this.axios
                .post(`/api/lobby/leave/${this.retrieveLobbyId()}/${this.retrieveNickname()}`)
                .then((res) => {
                    if (res.data == "OK"){
                        EventBus.$emit('showAlert', {
                            color: "success",
                            type: "success",
                            msg: `You left the lobby`
                        });
                        this.removeSession();
                        this.$router.push(`/`);
                    }
                })
                .catch((e) => {
                    EventBus.$emit('showAlert', {
                        color: "error",
                        type: "error",
                        msg: `Error ${e.response.data.code}. ${e.response.data.message}`
                    });
                });
        },
        deleteLobby(){
            this.axios
                .delete(`/api/lobby/delete`)
                .catch((e) => {
                    EventBus.$emit('showAlert', {
                        color: "error",
                        type: "error",
                        msg: `Error ${e.response.data.code}. ${e.response.data.message}`
                    });
                });
        },
        lobbiesMatch() {
            return (this.$route.params.lobbyId.toUpperCase() == this.retrieveLobbyId().toUpperCase());
        },
        isAdmin(){
            return (this.myNickname == this.lobbyInfo.gameAdmin);
        },
        goBack(){
            this.$router.push('/');
        },
        manageConnectedPlayers(wsBody){
                if (wsBody.interaction == 'JOIN'){
                    if (!this.isPlayerIdInConnectedPlayers(wsBody.senderId)) this.connectedPlayersIds.push(wsBody.senderId);
                } else if (wsBody.interaction == 'LEAVE' || wsBody.interaction == 'KICK'){
                    this.connectedPlayersIds = this.connectedPlayersIds.filter(id => id != wsBody.senderId);
                }
        },
        isPlayerIdInConnectedPlayers(playerId){
            return this.connectedPlayersIds.includes(playerId);
        },
        nameItsMe(nick){
            return (nick == this.myNickname);
        }
    },
}
</script>
<style scoped>
.infoList {
    background-color: #4d4d4d;
}

div.col.col-4>div>div>div>div.v-list-item__subtitle {
    color: aqua !important;
}
</style>
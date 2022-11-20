<template>
    <v-container>
        <v-row justify="center">
            <v-card class="mx-auto" elevation="0" dark height="60vh" width="100%" color="background1">
                <v-list color="background1">
                    <v-list-item dense class="infoList mt-n1">
                        <v-list-item-icon>
                            <v-icon>mdi-chat</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="text-button">Game Chat</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card height="46vh" elevation="0" color="background2 chatCard">
                        <v-list-item dense v-for="(msg, i) in chatMessages" :key="i" class="chatMsg ml-n4">
                            <v-col cols="3"  :class="(msg.senderNickname == nickname) ? 'me' : 'someone'" class="senderRBorder">
                                <v-icon
                                small
                                class="mr-2"
                                >mdi-account-voice</v-icon>{{ msg.senderNickname }}
                                <v-divider
                                    vertical
                                ></v-divider>
                                <v-icon
                                small
                                class="ml-3 mr-1"
                                >mdi-clock-time-three-outline</v-icon>{{ msg.time }} 
                            </v-col>
                            <v-col cols="9">
                                {{ msg.message }}
                            </v-col>
                        </v-list-item>
                    </v-card>
                </v-list>
                <v-card class="d-flex" color="background1" elevation="0">
                    <v-text-field class="px-2" label="Say something!" outlined v-model="message"></v-text-field>
                    <v-btn dark outlined x-large color="info" class="mr-2" @click="sendChatMessage(message)"> SEND
                    </v-btn>
                </v-card>
            </v-card>
        </v-row>
    </v-container>
</template>
<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { EventBus } from "@/main";
import { mixins } from '@/mixins';
export default {
    mixins: [mixins],
    components: {
    },
    data: () => ({
        socket: null,
        stompClient: null,
        chatConnected: false,
        chatMessages: [],
        message: '',
        chatRoom: '',
        nickname: '',
        playerId: '',
        token: ''
    }),
    computed: {

    },
    created() {
        this.chatRoom = this.retrieveLobbyId();
        this.nickname = this.retrieveNickname();
        this.playerId = this.retrievePlayerId();
        this.token = this.retrieveAcessToken();
        this.connectToWS();
        EventBus.$on('lobbyChat_disconnectWs', () => this.disconnectWs());
    },
    methods: {
        connectToWS() {
            this.socket = new SockJS('http://localhost:9876/websocket', null, {
                sessionId: () => {
                    return this.chatRoom + ":" + this.playerId + ":" + this.nickname + ":" + Math.floor(Math.random() * 99999);
                }
            });
            this.stompClient = Stomp.over(this.socket);
            this.stompClient.debug = () => { };
            this.stompClient.connect({
                senderId: this.playerId,
                token: this.token,
                senderNickname: this.nickname,
                lobby: this.chatRoom
            },
                frame => {
                    this.chatConnected = true;
                    this.stompClient.subscribe(`/topic/messages/${this.chatRoom}`, tick => {
                        this.filterLobbyInteraction(JSON.parse(tick.body));
                    });
                    EventBus.$emit('reloadPlayersInLobby');
                },
                error => {
                    this.chatConnected = false;
                    EventBus.$emit('showAlert', {
                        color: "error",
                        type: "error",
                        msg: "Error connecting to the Generala Websocket server."
                    });
                });
        },
        disconnectWs(){
            console.log("ws off");
            this.stompClient.disconnect();
        },
        sendChatMessage(chatMessage) {
            this.sendMessage(
                {
                    interaction: 'MESSAGE',
                    message: chatMessage,
                    senderId: this.playerId,
                    senderNickname: this.nickname,
                    dateTime: ''
                }
            );
        },
        sendMessage(msg) {
            this.stompClient.send(`/ws/chat/${this.chatRoom}`,
                JSON.stringify(msg), {}
            );
            this.message = "";
        },
        scrollChat() {
            const div = document.querySelector('.chatCard');
            if (div.scrollTop < div.scrollHeight - div.clientHeight) div.scrollTop += 100; // move down
        },
        filterLobbyInteraction(body) {

            switch (body.interaction) {
                case 'MESSAGE':
                    this.chatMessages.push(body);
                    setTimeout(() => {
                        this.scrollChat();
                    }, 100);
                    break;
                case 'JOIN':
                    if (body.senderId != this.playerId) {
                        EventBus.$emit('showAlert', {
                            color: "success",
                            type: "info",
                            msg: `${body.message}`
                        });
                        EventBus.$emit('lobbyRoom_playersStatus',body);
                    }
                    break;
                case 'LEAVE':
                    if (body.senderId != this.playerId) {
                        EventBus.$emit('showAlert', {
                            color: "warning",
                            type: "warning",
                            msg: `${body.message}`
                        });
                    }
                    EventBus.$emit('lobbyRoom_playersStatus',body);
                    break;
                case 'SPAM':
                    if (body.senderId == this.playerId) {
                        EventBus.$emit('showAlert', {
                            color: "error",
                            type: "error",
                            msg: `${body.message}`
                        });
                    }
                    break;
                case 'KICK':
                    if (body.senderId == this.playerId) {
                        EventBus.$emit('showAlert', {
                            color: "error",
                            type: "error",
                            msg: `You have been kicked from the lobby`
                        });
                        this.disconnectWs();
                        this.removeSession();
                        this.$router.push(`/`);
                    } else {
                        EventBus.$emit('showAlert', {
                            color: "warning",
                            type: "info",
                            msg: `${body.message}`
                        });
                        EventBus.$emit('lobbyRoom_playersStatus',body);
                    }
                    break;
                case 'DELETE':
                        EventBus.$emit('showAlert', {
                            color: "warning",
                            type: "info",
                            msg: `${body.message}`
                        });
                        this.disconnectWs();
                        this.removeSession();
                        this.$router.push(`/`);
                    break;
                case 'START':
                    if (body.senderId.includes("count_")) {
                        EventBus.$emit('countdown', {
                            color: "primary",
                            type: "info",
                            msg: `${body.message}`,
                            count: body.senderId
                        });
                        if (body.senderId.includes("count_0")){
                            this.$router.push("/game");
                            setTimeout(() => {
                                this.disconnectWs();
                            }, 50);
                        } 
                    }
                    break;
            }

        },
    },
}
</script>
<style>
.me {
    color: greenyellow !important;
}
.chatMsg {
    border-bottom: 1px solid rgba(128, 128, 128, .1);
    background-color: rgba(73, 73, 73, .1);
}
.senderRBorder {
    border-right: 1px solid rgba(128, 128, 128, .1);
    background-color: rgba(73, 73, 73, .2);
}
.someone {
    color: aqua !important
}
.chatCard {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
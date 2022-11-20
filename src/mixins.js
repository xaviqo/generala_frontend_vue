export const mixins = {
    methods: {
        isSessionSetted() {
            return (localStorage.getItem("generalanet_session") != null)
        },
        saveSession(data){
            localStorage.setItem("generalanet_session", JSON.stringify(data));
        },
        removeSession(){
            localStorage.removeItem('generalanet_session');
        },
        retrieveSession(){
            return JSON.parse(localStorage.getItem('generalanet_session'));
        },
        retrievePlayerId(){
            return JSON.parse(localStorage.getItem('generalanet_session')).playerId;
        },
        retrieveAcessToken(){
            return JSON.parse(localStorage.getItem('generalanet_session'))['tokenPayload'].accessToken;
        },
        retrieveRefreshToken(){
            return JSON.parse(localStorage.getItem('generalanet_session'))['tokenPayload'].refreshToken;
        },
        retrieveLobbyId(){
            return JSON.parse(localStorage.getItem('generalanet_session')).lobbyId;
        },
        retrieveNickname(){
            return JSON.parse(localStorage.getItem('generalanet_session')).nickname;
        }
    }
}
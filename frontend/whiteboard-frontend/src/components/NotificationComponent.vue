<template>
    <div class="notification">
        <div class="rectangle bg-primary p-4 mt-1 rounded-2 shadow-lg" :hidden="hide" >
            <div class="notification-text">
                <span class="text-white">{{username}} si è connesso alla tua lavagna!</span>
            </div>
        </div>
    </div>
</template>

<script>
import {socket} from "@/scripts/socket";

export default {
    name: "NotificationComponent",
    data() {
        return {
            hide: true,
            connected : false,
            accessToken: localStorage.getItem("accessToken"),
            username: "Guest"
        }
    },
    created() {
        this.connected = true;
    },
    mounted() {
        // todo add the remaining attributes to socket.IO calls
        socket.on("user-connected", (username) => {
            this.username = username;
            this.hide = false;
            setTimeout(() => {
                this.hide = true;
            }, 3000);
        });

    },
    unmounted() {
        this.connected = false;
        socket.removeAllListeners();
        socket.disconnect();
    },
    methods:{
    }
}

</script>

<style scoped>
.notification{
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 2vh;
}

</style>
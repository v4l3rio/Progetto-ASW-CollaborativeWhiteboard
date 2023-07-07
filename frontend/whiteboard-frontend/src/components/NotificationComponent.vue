<template>
    <div class="container">
        <div class="rectangle bg-primary" :class="{ animate: animationEffect}">
            <div class="notification-text">
                <span>{{username}} si è connesso alla tua lavagna!</span>
            </div>
        </div>
    </div>
</template>

<script>
import { io } from "socket.io-client";
import {socket} from "@/scripts/socket";
const URL = "http://localhost:4000";

export default {
    name: "SocketComponent",
    data() {
        return {
            animationEffect: false,
            connected : false,
            username: undefined,
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg4NjU0OTI3LCJleHAiOjE2ODg3NDEzMjd9.9j_Q-VufaGdfaPfVq5cocQ3qP_2cMqPhcVTnGBQpucw", // todo take from local storage
        }
    },
    created() {
        /* todo first, connect to express API to get whiteboard data (and put them in the canvas,
            then try to connect with socket io
        */
        this.connected = true;
    },
    mounted() {

        // todo add the remaining attributes to socket.IO calls
        socket.on("notify-my-connection", (username) => {
            this.username = username;
            this.animationEffect = true;
            setTimeout(() => {
                this.animationEffect = false;
            }, 3000)

        });

    },
    unmounted() {
        this.connected = false;
        socket.removeAllListeners('notify-my-connection');
        socket.disconnect();
    },
    methods:{
    }
}

</script>

<style scoped>
html,
body {
    height: 100%;
}

.container {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.rectangle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    positon: relative;
    width: 50px;
    height: 50px;
    transform: scale(0);
    border-radius: 50%;
    color: white;
    opacity: 0;
    overflow: hidden;
}

.animate{
    animation: scale-in .3s ease-out forwards,
    expand .35s .25s ease-out forwards;
}


.notification-text {
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;

}

@keyframes fadeOut {
    0% {
        opacity:1;
    }
    100% {
        opacity:0;
    }
}

@keyframes scale-in {
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes expand {
    50% {
        width: 350px;
        border-radius: 6px;
    }
    100% {
        width: 300px;
        border-radius: 4px;
        box-shadow: 0px 1px 3px 0px rgba(0,0,0,.2),
        0px 1px 1px 0px rgba(0,0,0,.14),
        0px 3px 3px -1px rgba(0,0,0,.12);
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: .8;
    }
}
</style>
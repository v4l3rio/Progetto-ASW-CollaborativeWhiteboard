<template>
</template>

<script>
import { io } from "socket.io-client";
const URL = "http://localhost:4000";

export default {
    name: "SocketComponent",
    data() {
        return {
            connected : false,
            socket: {},
        }
    },
    created() {
      this.socket = io(URL, { query: {
              "userId": "vale",
              "whiteBoardId": 1
      }});
    },
    mounted() {
        this.socket.on("drawStartBC", (cursorX, cursorY) => {
            this.$emit('drawStartBC', {x: cursorX, y: cursorY});
        });
        this.socket.on("drawingBC", (cursorX, cursorY) => {
            this.$emit('drawingBC', {x: cursorX, y: cursorY})
        });
        this.socket.on("drawEndBC", (cursorX, cursorY) => {
            this.$emit('drawEndBC', {x: cursorX, y: cursorY})
        });
        this.socket.on("disconnect", () => {
            this.connected = false;
        });
    },
    methods:{
        drawStart(cursorX, cursorY){
            this.socket.emit("drawStart", cursorX, cursorY);
        },
        drawing(cursorX, cursorY){
            this.socket.emit("drawing", cursorX, cursorY);
        },
        drawEnd(cursorX, cursorY){
            this.socket.emit("drawEnd", cursorX, cursorY);
        }
    }
}

</script>

<style scoped>

</style>
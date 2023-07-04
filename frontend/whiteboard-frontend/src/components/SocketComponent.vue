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
        /* todo first, connect to express API to get whiteboard data (and put them in the canvas,
            then try to connect with socket io
        */
      this.socket = io(URL, { query: {
              "userId": "vale",
              "whiteBoardId": 1
      }});
    },
    mounted() {
        // todo add the remaining attributes to socket.IO calls
        this.socket.on("drawStartBC", (cursorX, cursorY, color) => {
            this.$emit('drawStartBC', {id: "1", point:{x: cursorX, y: cursorY}, color: color});
        });
        this.socket.on("drawingBC", (cursorX, cursorY) => {
            this.$emit('drawingBC', {id: "1", point:{x: cursorX, y: cursorY}})
        });
        this.socket.on("drawEndBC", (line, color) => {
            this.$emit('drawEndBC', {id:"1", points:line, color: color});
        });
        this.socket.on("disconnect", () => {
            this.connected = false;
        });
    },
    methods:{
        drawStart(cursorX, cursorY, color){
            this.socket.emit("drawStart", cursorX, cursorY, color);
        },
        drawing(cursorX, cursorY){
            this.socket.emit("drawing", cursorX, cursorY);
        },
        drawEnd(lineToSend, color){
            this.socket.emit("drawEnd", lineToSend, color);
        }
    }
}

</script>

<style scoped>

</style>
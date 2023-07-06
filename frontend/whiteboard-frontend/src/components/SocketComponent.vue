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
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg4NjU0OTI3LCJleHAiOjE2ODg3NDEzMjd9.9j_Q-VufaGdfaPfVq5cocQ3qP_2cMqPhcVTnGBQpucw", // todo take from local storage
            drawingId: "",
            socket: {},
        }
    },
    created() {
        /* todo first, connect to express API to get whiteboard data (and put them in the canvas,
            then try to connect with socket io
        */
      this.socket = io(URL, { query: {
              "accessToken": this.accessToken,
              "whiteBoardId": 0,
              "type": 'whiteboard'
      }});
      this.connected = true;
    },
    mounted() {

        // todo add the remaining attributes to socket.IO calls
        this.socket.on("drawStartBC", (line, newId) => {
            this.$emit('drawStartBC', {id: newId, point:{x: line.cursorX, y: line.cursorY}, color: line.color});
        });
        this.socket.on("drawingBC", (line, lineId) => {
            this.$emit('drawingBC', {id: lineId, point:{x: line.cursorX, y: line.cursorY}})
        });
        this.socket.on("drawEndBC", (line, lineId) => {
            this.$emit('drawEndBC', {id:lineId, points:line.points, color: line.color});
        });

    },
    unmounted() {
        this.connected = false;
        this.socket.disconnect();
    },
    methods:{
        drawStart(cursorX, cursorY, color){
            this.socket.emit("drawStart", {cursorX, cursorY, color}, this.accessToken, (response) => {
                console.log(response.newId);
                this.drawingId = response.newId;
            });
        },
        drawing(cursorX, cursorY){
            this.socket.emit("drawing", {cursorX, cursorY}, this.drawingId, this.accessToken);
        },
        drawEnd(lineToSend, color){
            this.socket.emit("drawEnd", {points:lineToSend, color}, this.drawingId, this.accessToken);
        },
        getSocket(){
            return this.socket;
        }
    }
}

</script>

<style scoped>

</style>
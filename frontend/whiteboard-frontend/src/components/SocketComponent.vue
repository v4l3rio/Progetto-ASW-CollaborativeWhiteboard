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
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZyZXNobWFnIiwiaWF0IjoxNjg4NTUxNzM3LCJleHAiOjE2ODg1NTIzMzd9.cJwu-DzAwC_DIDJ-7FCX8KY6ltaeFwqwrg6-JeB51II", // todo take from local storage
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
              "whiteBoardId": 1
      }});
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
        this.socket.on("disconnect", () => {
            this.connected = false;
        });
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
        }
    }
}

</script>

<style scoped>

</style>
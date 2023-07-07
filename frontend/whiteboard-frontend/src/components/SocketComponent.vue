<template>
</template>

<script>

import {socket} from "@/scripts/socket";

const URL = "http://localhost:4000";

export default {
    name: "SocketComponent",
    props: {
      whiteboardId: String
    },
    data() {
        return {
            connected : false,
            drawingId: "",
            accessToken: localStorage.getItem("accessToken")
        }
    },
    created() {
        /* todo first, connect to express API to get whiteboard data (and put them in the canvas,
            then try to connect with socket io
        */

       this.connected = true;
    },
    mounted() {
        socket.emit("joinWhiteboard", this.accessToken, this.whiteboardId, (response) => {
            console.log(response);
            // todo add the remaining attributes to socket.IO calls

        });
        socket.on("drawStartBC", (line, newId) => {
            console.log("ADAADADADAA")
            this.$emit('drawStartBC', {id: newId, point:{x: line.cursorX, y: line.cursorY}, color: line.color});
        });
        socket.on("drawingBC", (line, lineId) => {
            this.$emit('drawingBC', {id: lineId, point:{x: line.cursorX, y: line.cursorY}})
        });
        socket.on("drawEndBC", (line, lineId) => {
            this.$emit('drawEndBC', {id:lineId, points:line.points, color: line.color});
        });
    },
    unmounted() {
        this.connected = false;
        socket.disconnect();
    },
    methods:{
        drawStart(cursorX, cursorY, color){
           socket.emit("drawStart", {cursorX, cursorY, color}, this.accessToken, (response) => {
                console.log(response.newId);
                this.drawingId = response.newId;
            });
        },
        drawing(cursorX, cursorY){
            socket.emit("drawing", {cursorX, cursorY}, this.drawingId, this.accessToken);
        },
        drawEnd(lineToSend, color){
            socket.emit("drawEnd", {points:lineToSend, color}, this.drawingId, this.accessToken);
        },
    }
}

</script>

<style scoped>

</style>
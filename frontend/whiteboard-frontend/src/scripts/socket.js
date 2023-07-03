import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
    connected: false,
});

// "undefined" means the URL will be computed from the `window.location` object
const URL= "http://localhost:4000";

export const socket = io(URL, { query: {
        "userId": "vale",
        "whiteBoardId": 1
    }});



export function drawStart(cursorX, cursorY){
    socket.emit("drawStart", cursorX, cursorY);
}

export function drawing(cursorX, cursorY){
    socket.emit("drawing", cursorX, cursorY);
}

export function drawEnd(cursorX, cursorY){
    socket.emit("drawEnd", cursorX, cursorY);
}

socket.on("drawStartBC", (cursorX, cursorY) => {
    console.log(cursorX, cursorY);
    this.$emit('drawStartBC', {x: cursorX, y: cursorY});
});
socket.on("drawingBC", (cursorX, cursorY) => {
    console.log(cursorX, cursorY);
    this.$emit('drawingBC')
});
socket.on("drawEndBC", (cursorX, cursorY) => {
    console.log(cursorX, cursorY);
    this.$emit('drawEndBC')
});
socket.on("disconnect", () => {
    state.connected = false;
});

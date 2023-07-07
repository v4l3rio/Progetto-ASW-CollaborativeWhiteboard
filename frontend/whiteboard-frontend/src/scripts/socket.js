import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:4000";
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg4NjU0OTI3LCJleHAiOjE2ODg3NDEzMjd9.9j_Q-VufaGdfaPfVq5cocQ3qP_2cMqPhcVTnGBQpucw";
export const socket = io(URL, { query: {
        "accessToken": accessToken,
        "whiteBoardId": 0,
        "type": 'whiteboard'
}});



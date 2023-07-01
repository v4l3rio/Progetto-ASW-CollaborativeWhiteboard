/*
 * Required packages
 */
const express = require('express');
const app = express();
const http = require('http');


/*
 * Middlewares
 */
app.use(express.json());
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/RealtimeTest.html")
})
app.listen(3000, () => {
    console.log("TEST ON " + 3000)
});
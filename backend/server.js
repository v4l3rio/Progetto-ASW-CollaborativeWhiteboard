/*
 * Required packages
 */
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const {requestMethod} = require("./src/auth/requestMethod");
const http = require('http');
const cors = require('cors');

const {printServerStart} = require("./src/util/consoleUtil");

// ----------------------------------------------------------------------------
const PORT = 4000;
process.env.REFRESH_TOKEN_KEY = "213918903"; // todo move somewhere safe
process.env.ACCESS_TOKEN_KEY = "142530983"; // todo move somewhere safe
// ----------------------------------------------------------------------------


var corsOptions = {
    origin: "http://localhost:8081"
}

/*
 * Routers for this API
 */
const indexRouter = require('./src/routes/indexRoutes');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const whiteboardRoutes = require('./src/routes/whiteboardRoutes');

/*
 * Middlewares
 */
app.use(cors(corsOptions)); // Add cors middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.json())
app.use(requestMethod);

/*
 * ROUTES
 */
app.use(indexRouter);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/whiteboard", whiteboardRoutes)

const server = http.createServer(app);

/*
 * REAL-TIME ENVIRONMENT (example)
 */
const {Realtime} = require('./src/realtime/api/Realtime');
const whiteboardController = require("./src/controllers/whiteboardController");
const rt = new Realtime(server, whiteboardController);
rt.listen();
exports.realtime = rt;


server.listen(PORT, () => {
    printServerStart(PORT);
});
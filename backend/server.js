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
// ----------------------------------------------------------------------------


/*
 * Routers for this API
 */
const indexRouter = require('./src/routes/indexRoutes');
const exampleSubRouter = require('./src/routes/exampleSubRoutes');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

/*
 * Middlewares
 */
app.use(cors()); // Add cors middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.json())
app.use(requestMethod);

/*
 * ROUTES
 */
app.use(indexRouter);
app.use("/example", exampleSubRouter);

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

const server = http.createServer(app);

/*
 * REAL-TIME ENVIRONMENT (example)
 */
const {Realtime} = require('./src/realtime/api/Realtime');
const rt = new Realtime(server);
rt.listen();
exports.realtime = rt;


server.listen(PORT, () => {
    printServerStart(PORT);
});
const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');

/**
 * Routers for this API
 */
const indexRouter = require('./src/routes/indexRoutes');
const exampleSubRouter = require('./src/routes/exampleSubRoutes');

app.use(cors()); // Add cors middleware
app.use(express.json());

const PORT = 4000;


/**
 * ROUTES
 */
app.use(indexRouter);
app.use("/example", exampleSubRouter);

const server = http.createServer(app);

/**
 * REAL-TIME ENVIRONMENT (example)
 */
const {Realtime} = require('./src/realtime/api/Realtime');
const rt = new Realtime(server);

server.listen(PORT, () => `Server is running on http://localhost:${PORT}`);
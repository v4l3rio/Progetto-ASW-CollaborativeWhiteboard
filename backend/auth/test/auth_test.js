const express = require('express');
const {Authenticator} = require("../Authenticator");
const app = express();
const {serialize} = require("cookie");
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json())
const port = 3000;

class Db {
    constructor() {
        this.lastId = 0;
        this.users = [];
    }

    async findOne(username) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username === username) {
                return this.users[i];
            }
        }
        return undefined;
    }

    async createUser(user) {
        const toCreate = {
            id: this.lastId,
            username: user.username,
            password: user.password,
            first_name: user.first_name,
            last_name: user.last_name
        };
        this.users.push(toCreate);
        this.lastId++;
        return toCreate;
    }
}
const db = new Db();
const auth = new Authenticator(db)
app.post('/register', (req, res) => {
    if (req.body.username && req.body.password && req.body.first_name && req.body.last_name) {
        const {username, password, first_name, last_name} = req.body;
        auth.register({first_name: first_name, last_name:last_name,username:username, password:password})
            .then((result) => {
                if (result.err) {
                    console.log("Error: " + result.err)
                    res.status(400).json({message: result.err})
                } else {
                    const created = result.user;
                    const noPasswordUser = {id: created.id, username:created.username,
                        first_name:created.first_name, last_name: created.last_name};
                    console.log("Created user " + JSON.stringify(noPasswordUser));
                    res.status(200)
                        .json({"message": "User created successfully",
                                    "user" : noPasswordUser});
                }

            });
    } else {
        res.status(400).json({"message" : "Bad input, please provide username, password, " +
                "first name and last name"})
    }
})

app.post("/login", (req, res) => {
    if (req.body.username && req.body.password) {
        const {username, password} = req.body;
        auth.login({username:username, password:password})
            .then((result) => {
                if (result.err) {
                    console.log("Error: " + result.err)
                    res.status(400).json({message: result.err})
                } else {
                    const logged = result.user;
                    const noPasswordUser = {id: logged.id, username:logged.username};
                    /*const serialized = serialize('token', logged.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 24 * 30,
                        path: '/',
                    });

                     */
                    res.cookie("token", logged.token, {httpOnly: true, secure: true, maxAge:60 * 60 * 24 * 30})

                    console.log("Logged user " + JSON.stringify(noPasswordUser));
                    res.status(200)
                        .json({"message": "User logged successfully",
                            "user" : noPasswordUser});
                }

            });
    } else if (req.cookies && req.cookies.token){
        auth.validateToken(req.cookies.token).then(result => {
            if (result.err) {
                res.status(401).json({"message": "Invalid Token"});
            } else {
                res.status(200)
                    .json({"message": "User logged successfully", "decoded": result.token});
            }
        })
    } else {
        const {cookies} = req;
        console.log(cookies)
        res.status(400).json({"message" : "Bad input, please provide username and password"})
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));



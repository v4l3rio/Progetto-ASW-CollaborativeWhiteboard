const express = require('express');
const {Authenticator} = require("../Authenticator");
const app = express();
const port = 3000;

class Db {
    constructor() {
        this.lastId = 4;
        this.users = [{
            id: 1,
            username: "cape",
            password: "test"
        },
        {
            id: 2,
            username: "vezio",
            password: "test"
        },
        {
            id: 3,
            username: "muschio",
            password: "test"
        },
        ];
    }

    async findOne(username) {
        const result = this.users
            .map(user => user.username)
            .filter((name) => name === username);
        console.log(result);
        return result;
    }

    async createUser(user) {
        this.users.append({
            id: this.lastId,
            username: user.username,
            password: user.password
        });
        this.lastId++;
    }
}
const db = new Db();
const auth = new Authenticator(db)
app.post('/register', (req, res) => {
    if (req.query.username && req.query.password) {
        auth.register(req.query.username, req.query.password)
            .then(r => {
                res
                .status(200)
                .json({"message": "Tutto bene " + r});
                db.findOne({username: req.query.username, password: req.query.password}).then((user) => {
                    console.log(user);
                });
            });
    } else {
        res.status(400).json({"message" : "Sbagliato"})
    }
})

app.listen(port, () => console.log(`Server is running on port ${port}`));



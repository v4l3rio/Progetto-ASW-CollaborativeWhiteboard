const express = require('express');
const {Authenticator} = require("../Authenticator");
const app = express();
app.use(express.json())
const port = 3000;

class Db {
    constructor() {
        this.lastId = 0;
        this.users = [];
    }

    async findOne(username) {
        //console.log(this.users)
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

app.listen(port, () => console.log(`Server is running on port ${port}`));



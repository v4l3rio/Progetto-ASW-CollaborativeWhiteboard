
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
exports.Authenticator = class Authenticator {
    constructor(db) {
        this.db = db;
    }

    async register(userData) {
        // Our register logic starts here
        try {
            // Get user input
            const { first_name, last_name, username, password } = userData;

            // Validate user input
            if (!(username && password && first_name && last_name)) {
                return {undefined,err:"All input is required"};
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await db.findOne(username);

            if (oldUser) {
                return{undefined,err:"User Already Exist. Please Login"};
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await db.createUser({
                first_name,
                last_name,
                username: username.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;

            // return new user
            return {user}
        } catch (err) {
            return {undefined,err}
        }
    }

    async login(userData) {

        if (!(userData.username && userData.password)) {
            return {undefined, err:"Please input username and password"};
        }
        const {username, password} = userData;
        // Validate if user exist in our database
        const user = await db.findOne({ username:username });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            return {user}
        }
    }

    async validateToken(token) {
        if (!token) {
            return {undefined,err: "A token is required for authentication"};
        }
        try {
            const decoded = jwt.verify(token, config.TOKEN_KEY);
            return {decoded}
        } catch (err) {
            return {undefined, err:"Invalid Token"};
        }
    }
}
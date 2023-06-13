
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
exports.Authenticator = class Authenticator {
    constructor(db) {
        this.db = db;
        this.tokenKey = "213918903";//process.env.TOKEN_KEY
    }

    async register(userData) {
        // Our register logic starts here
        try {
            // Get user input
            const { first_name, last_name, username, password } = userData;
            // Validate user input
            if (!(username && password && first_name && last_name)) {
                return {user: "",err:"All input is required"};
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await this.db.findOne(username);

            if (oldUser) {
                return{user: "",err:"User Already Exist. Please Login"};
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await this.db.createUser({
                first_name,
                last_name,
                username: username.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create token
            // save user token
            user.token = jwt.sign(
                {user_id: user._id, username},
                this.tokenKey,
                {
                    expiresIn: "2h",
                }
            );

            // return new user
            return {user: user}
        } catch (err) {
            return {undefined,err}
        }
    }

    async login(userData) {

        if (!(userData.username && userData.password)) {
            return {user:"", err:"Please input username and password"};
        }
        const {username, password} = userData;
        // Validate if user exist in our database
        const user = await this.db.findOne(username);

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            // save user token
            user.token = jwt.sign(
                {user_id: user._id, username},
                this.tokenKey,
                {
                    expiresIn: "2h",
                }
            );

            // user
            return {user:user, err:""}
        }
        return {user:"", err: "User not registered or wrong password"}
    }

    async validateToken(token) {
        if (!token) {
            return {token:undefined,err: "A token is required for authentication"};
        }
        try {
            const decoded = jwt.verify(token, this.tokenKey);
            return {token:decoded}
        } catch (err) {
            return {token:undefined, err:"Invalid Token"};
        }
    }
}
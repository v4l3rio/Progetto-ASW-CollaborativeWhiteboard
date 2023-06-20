
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
exports.Authenticator = class Authenticator {
    constructor(db) {
        this.db = db;
        this.refreshTokenKey = "213918903";//process.env.TOKEN_KEY
        this.accessTokenKey = "142530983";
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
            // Create refresh token
            user.refreshToken = jwt.sign(
                {user_id: user._id, username},
                this.refreshTokenKey,
                {
                    expiresIn: "1d",
                }
            );

            user.accessToken = jwt.sign(
                {user_id: user._id, username},
                this.accessTokenKey,
                {
                    expiresIn: "10m"
                }
            )

            // user
            return {user:user, err:""}
        }
        return {user:"", err: "User not registered or wrong password"}
    }

    async validateRefreshToken(token) {
        if (!token) {
            return {user:undefined,err: "A token is required for authentication"};
        }
        try {
            const decoded = jwt.verify(token, this.refreshTokenKey);
            return {user:decoded, token: jwt.sign(
                {username:decoded.username, user_id: decoded._user_id},
                this.accessTokenKey,
                {
                    expiresIn: "10m"
                }
            ), err: undefined}
        } catch (err) {
            return {user:undefined, err:"Invalid Token"};
        }
    }

    async refreshToken(token) {
        return this.validateRefreshToken(token).then(result => {
            if (result.err) {
                return {token: undefined, err: "Unauthorized"}
            }
            return {
                token: jwt.sign(
                    {username:result.user.username, user_id: result.user._user_id},
                    this.accessTokenKey,
                    {
                        expiresIn: "10m"
                    }
                )
            }
        })
    }
    // granting authorization NOT authentication
    async validateAccessToken(token) {
        if (!token) {
            return {user:undefined,err: "A token is required for authorization"};
        }
        try {
            const decoded = jwt.verify(token, this.accessTokenKey);
            return {user:decoded, err: undefined}
        } catch (err) {
            return {user:undefined, err:"Invalid Token"};
        }
    }
}
const jwt = require("jsonwebtoken");
const {TestModel} = require("../models/testModel");

const OWNER = 0;
const NORMAL = 1;
exports.Authorizer = class {
    constructor(model) {
        this.model = model;
        this.accessKey = process.env.ACCESS_TOKEN_KEY;
    }
     async userToWhiteboard(level, accessToken, whiteboardId) {
        if (!accessToken || !whiteboardId) {
            return {err: "Please input accessToken and whiteboardId"};
        }
        try {
            const decoded = await jwt.verify(accessToken, this.accessKey);
            let authorized;
            if (level === OWNER) {
                authorized = await TestModel.validateOwnerToWhiteboard(decoded.username, whiteboardId);
            } else {
                authorized = await TestModel.validateUserToWhiteboard(decoded.username, whiteboardId);
            }
            if (!authorized) {
                return {err: "Unauthorized to this whiteboard"};
            } else {
                return {username: decoded.username };
            }
        } catch (e) {
            return {err: "Invalid token or illegal input values"};
        }
    }

    // used in both socket io messages and in profileController.js
    async normalUserToWhiteboard(accessToken, whiteboardId) {
        return this.userToWhiteboard(NORMAL, accessToken, whiteboardId)
    }

    async ownerToWhiteboard(accessToken, whiteboardId) {
        return this.userToWhiteboard(OWNER, accessToken, whiteboardId);
    }

    async authorizeNewLine(accessToken, whiteboardId) {
        return this.normalUserToWhiteboard(accessToken, whiteboardId);
    }

    async authorizeLineEnd(accessToken, lineId, whiteboardId) {
        return this.normalUserToWhiteboard(accessToken, whiteboardId);
    }

    async authorizeLineDelete(accessToken, lineId, whiteboardId) {
        return this.normalUserToWhiteboard(accessToken, whiteboardId);
    }
}
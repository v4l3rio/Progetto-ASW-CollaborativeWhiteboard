const jwt = require("jsonwebtoken");
const {TestModel} = require("../models/testModel");
exports.Authorizer = class {
    constructor(model) {
        this.model = model;
        this.accessKey = process.env.ACCESS_TOKEN_KEY;
    }

    // used in both socket io messages and in profileController.js
    async authorizeToWhiteboard(accessToken, whiteboardId) {
        if (!accessToken || !whiteboardId) {
            return {err: "Please input accessToken and whiteboardId"};
        }
        try {
            const decoded = await jwt.verify(accessToken, this.accessKey);
            const authorized = await TestModel.validateUserToWhiteboard(decoded.username, whiteboardId);
            if (!authorized) {
                return {err: "Unauthorized to this whiteboard"};
            } else {
                return {};
            }
        } catch (e) {
            return {err: "Invalid token"};
        }
    }

    async authorizeNewLine(accessToken, whiteboardId) {
        return this.authorizeToWhiteboard(accessToken, whiteboardId);
    }

    async authorizeLineEnd(accessToken, lineId, whiteboardId) {
        return this.authorizeToWhiteboard(accessToken, whiteboardId);
    }

    async authorizeLineDelete(accessToken, lineId, whiteboardId) {
        return this.authorizeToWhiteboard(accessToken, whiteboardId);
    }
}
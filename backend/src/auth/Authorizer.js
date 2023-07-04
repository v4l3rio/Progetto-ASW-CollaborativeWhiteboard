exports.Authorizer = class {
    constructor(model) {
        this.model = model;
    }

    // used in both socket io messages and in profileController.js
    async authorizeToWhiteboard(accessToken, whiteboardId) {

    }

    async authorizeNewLine(accessToken, whiteboardId) {

    }

    async authorizeLineEnd(accessToken, lineId, whiteboardId) {

    }

    async authorizeLineDelete(accessToken, lineId, whiteboardId) {

    }
}
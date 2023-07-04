exports.Authorizer = class {
    constructor(model) {
        this.model = model;
    }

    async authorizeToWhiteboard(accessToken, whiteboardId) {

    }

    async authorizeNewLine(accessToken, whiteboardId) {

    }

    async authorizeLineEnd(accessToken, lineId, whiteboardId) {

    }

    async authorizeLineDelete(accessToken, lineId, whiteboardId) {

    }
}
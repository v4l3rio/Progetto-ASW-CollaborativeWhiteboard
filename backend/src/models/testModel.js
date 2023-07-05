const {log} = require("../util/consoleUtil");

class Db {
    constructor() {
        this.userFreeId = 0;
        this.whiteboardFreeId = 0;
        this.users = [];
        this.whiteBoards = {};
    }

    async findOneUser(username) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username === username) {
                return this.users[i];
            }
        }
        return undefined;
    }
    async findOneWhiteboard(whiteboardId) {
        for (let i = 0; i < this.whiteBoards.length; i++) {
            if (this.whiteBoards[i].id === whiteboardId) {
                return this.whiteBoards[i];
            }
        }
        return undefined;
    }

    async createUser(user) {
        const toCreate = {
            id: this.userFreeId,
            username: user.username,
            password: user.password,
            first_name: user.first_name,
            last_name: user.last_name,
            notifications: [],
            whiteboards: []
        };
        this.users.push(toCreate);
        this.userFreeId++;
        return toCreate;
    }

    async createWhiteboard(name, username) {
        const user = await this.findOneUser(username)
        const userId = user?.id;
        if (user) {
            const toCreate = {
                id: this.whiteboardFreeId,
                name: name,
                ownerId: userId, // todo check for valid user id
                traits: {},
                freeId: 0,
                users: [userId]
            }
            this.whiteBoards[this.whiteboardFreeId] = toCreate;
            user.whiteboards.push(this.whiteboardFreeId);
            this.whiteboardFreeId++;
            return toCreate;
        }

    }

    async updateWhiteboard(whiteboardId, newName) {
        (await this.findOneWhiteboard(whiteboardId)).name = newName;
    }

    async deleteWhiteboard(whiteboardId) {
        const whiteboard = this.whiteBoards[whiteboardId];
        // remove the whiteboard from all the profiles
        if (whiteboard) {
            for (let i = 0; i < whiteboard.users.length; i++) {
                const user = this.users[whiteboard.users[i]];
                user.whiteboards.splice(whiteboardId, 1)
            }
            delete this.whiteBoards[whiteboardId];
        }

    }

    async generateFreshLineId(whiteboardId) {
        const whiteboard = this.whiteBoards[whiteboardId];
        const id = whiteboard.freeId;
        whiteboard.freeId++;
        while(whiteboard.traits[whiteboard.freeId]) {
            whiteboard.freeId++;
        }
        return id;
    }

    async insertLine(whiteboardId, lineId, line){
        const whiteboard = this.whiteBoards[whiteboardId];
        whiteboard.traits[lineId] = line;
    }

    async deleteLine(whiteboardId, lineId){
        delete this.whiteBoards[whiteboardId].traits[lineId];
    }

    async inviteUserToWhiteboard(username, whiteboardId) {
        const user = await this.findOneUser(username);
        const id = user.id;
        this.whiteBoards[whiteboardId].users.push(id);
        this.users[id].whiteboards.push(whiteboardId);
    }
    async validateUserToWhiteboard(username, whiteboardId) {
        const user = await this.findOneUser(username);
        if (user) {
            return this.whiteBoards[whiteboardId].users.includes(user.id);
        }
    }
    async validateOwnerToWhiteboard(username, whiteboardId) {
        const user = await this.findOneUser(username);
        if (user) {
            return this.whiteBoards[whiteboardId].ownerId === user.id;
        }
    }

    async getWhiteboards(username) {
        const outWhiteboards = [];
        const user = await this.findOneUser(username);
        if (user) {
            const ids = user.whiteboards;
            for (let i = 0; i < ids?.length; i++) {
                outWhiteboards.push(this.whiteBoards[ids[i]]);
            }
            return outWhiteboards;
        }

    }
}
exports.TestModel = new Db();
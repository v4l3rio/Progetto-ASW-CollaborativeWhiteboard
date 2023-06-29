class Db {
    constructor() {
        this.lastId = 0;
        this.users = [];
    }

    async findOne(username) {
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
exports.TestModel = new Db();
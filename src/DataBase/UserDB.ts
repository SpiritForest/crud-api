import User from './UserEntity'

export class UserDB {
    static instance: UserDB | undefined;
    users: User[];

    constructor() {
        this.users = [];
    }

    static getInstance(): UserDB {
        if (!UserDB.instance) {
            UserDB.instance = new UserDB();
        }

        return UserDB.instance;
    }

    getAll(): User[] {
        return this.users;
    }

    findById(id: string): User | undefined {
        return this.users.find((user) => user.id === id);
    }

    save(userData: User) {
        const index = this.users.findIndex((user) => user.id === userData.id);

        if (index > -1) {
            this.users.splice(index, 1, userData);
        } else {
            this.users.push(userData);
        }
    }

    update(id: string, body: User): User {
        const user = this.findById(id);

        if (user) {
            user.username = body.username;
            user.age = body.age;
            user.hobbies = body.hobbies;
        } else {
            throw new Error('User doesn\'t exits')
        }

        return user;
    }

    deleteById(id: string) {
        const index = this.users.findIndex((user) => user.id === id);

        if (index > -1) {
            this.users.splice(index, 1);
        }
    }

    synchronizeDB(users: User[]) {
        this.users = users;
    }
}
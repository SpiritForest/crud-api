import User from './UserEntity'

export class UserDB {
    users: User[]

    constructor() {
       this.users = []
    }

    getAll(): User[]  {
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

    deleteById(id: string) {
        const index = this.users.findIndex((user) => user.id === id);

        if (index > -1) {
            this.users.splice(index, 1);
        }
    }
}
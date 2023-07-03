import { v4 as uuid } from 'uuid';

import { IUser } from '../types/HTTPServerTypes';

export default class User implements IUser {
    age: number;
    hobbies: string[];
    id: string;
    username: string;

    constructor(userData: IUser) {
        this.age = userData.age;
        this.hobbies = userData.hobbies;
        this.username = userData.username;
        this.id = uuid();
        this.update(userData);
    }

    update(userData: IUser) {
        this.username = userData.username ?? this.username;
        this.age = userData.age ?? this.age;
        this.hobbies = userData.hobbies ?? this.hobbies;
    }
}
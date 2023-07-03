// @ts-nocheck
import request from 'supertest';

import { startServer } from '../main';

let server;

describe('Scenario 1: testing CRUD API in valid cases', function () {
    let user;

    before(async () => {
        server = await startServer();
    });

    after(async () => {
        await new Promise((res, rej) => {
            server.close(res);
        });
    });

    it('should has status code 200', function (done) {
        request(server).get('/api/users').expect(200, done);
    });

    it('should return an empty array', function (done) {
        request(server).get('/api/users').expect(200, [], done);
    });

    it('should create a user', function (done) {
        request(server)
            .post('/api/users')
            .send({
                username: 'John',
                age: 25,
                hobbies: ['tennis'],
            })
            .expect(201, done);
    });

    it('should return created users', function (done) {
        request(server)
            .get('/api/users')
            .expect(200)
            .expect((res) => {
                const users = res.body;

                const isUserExist = users.some((user) => {
                    return (
                        user.age === 25 &&
                        user.username === 'John' &&
                        JSON.stringify(user.hobbies) === JSON.stringify(['tennis'])
                    );
                });

                if (!isUserExist) {
                    throw new Error();
                } else {
                    user = users[0];
                }
            })
            .end(done);
    });

    it('should return a user by id', function (done) {
        request(server).get(`/api/users/${user.id}`).expect(200, user).end(done);
    });

    it('should return update user', function (done) {
        user.age = 30;
        user.hobbies = ['football', 'music', 'skiing'];

        request(server)
            .put(`/api/users/${user.id}`)
            .send(user)
            .expect(200, user)
            .end(done);
    });

    it('should delete user', function (done) {
        request(server).delete(`/api/users/${user.id}`).expect(204).end(done);
    });
});

describe('Scenario 2: testing CRUD API in invalid cases, status code 400', function () {
    before(async () => {
        server = await startServer();
    });

    after(async () => {
        await new Promise((res, rej) => {
            server.close(res);
        });
    });

    it('should return status code 400 if we don\'t send anything', function (done) {
        request(server).post('/api/users').send({}).expect(400, done);
    });

    it('should return status code 400 if we send invalid username', function (done) {
        request(server)
            .post('/api/users')
            .send({
                username: 1,
                age: 25,
                hobbies: ['football'],
            })
            .expect(400, done);
    });

    it('should return status code 400 if hobbies are not an array', function (done) {
        request(server)
            .post('/api/users')
            .send({
                username: "John",
                age: 25,
                hobbies: 'football',
            })
            .expect(400, done);
    });

    it('should return status code 400 if hobbies are not strings', function (done) {
        request(server)
            .post('/api/users')
            .send({
                username: "John",
                age: 25,
                hobbies: [1, "some hobby"],
            })
            .expect(400, done);
    });

    it('should return status code 400 if an age is missing', function (done) {
        request(server)
            .post('/api/users')
            .send({
                username: "John",
                hobbies: ['football'],
            })
            .expect(400, done);
    });

    it('should return status code 400 if hobbies are missing', function (done) {
        request(server)
            .post('/api/users')
            .send({
                username: "John",
                age: 10,
            })
            .expect(400, done);
    });

    it('should return status code 400 if a username is missing', function (done) {
        request(server)
            .post('/api/users')
            .send({
                age: 25,
                hobbies: ['football'],
            })
            .expect(400, done);
    });

    it('should return status code 400 if we don\'t send required field', function (done) {
        request(server)
            .post('/api/users')
            .send({
                username: 1,
                age: 25,
            })
            .expect(400, done);
    });
});

describe('Scenario 3: testing CRUD API in invalid cases, status code 404', function () {
    const nonExistedID = '109156be-c4fb-41ea-b1b4-efe1671c5836';
    before(async () => {
        server = await startServer();
    });

    after(async () => {
        await new Promise((res, rej) => {
            server.close(res);
        });
    });

    it('should return status code 404 Not Found if entered user\'s id doesn\'t exist', function (done) {
        request(server).get(`/api/users/${nonExistedID}`).expect(404).end(done);
    });

    it('should return status code 404 Not Found if deleted user\'s id doesn\'t exist', function (done) {
        request(server).delete(`/api/users/${nonExistedID}`).expect(404).end(done);
    });

    it('should return status code 404 Not Found if endpoint doesn\'t exit', function (done) {
        request(server).delete(`/not/existing/endpoint`).expect(404).end(done);
    });
});

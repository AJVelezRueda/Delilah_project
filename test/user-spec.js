process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const user = require('../controllers/user');
chai.use(chaiHttp);

const { withToken, getToken, signup, getUserId } = require("./setup");

const agent = chai.request.agent(server);

describe('Users', () => {
    beforeEach(async() => await user.clean());
    afterEach(async() => await user.clean());
    describe('GET /users', () => {
        it('should return a singleton list when there is an user recently created', async() => {
            await signup(agent, {
                name: "Johan Sebastian",
                email: "mastro@gmail.com",
                username: "juancitomastro",
                password: "sevaacaer"
            });

            const res = await withToken(agent.get('/users'))
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                users: [{
                    id: 1,
                    name: "Johan Sebastian",
                    email: "mastro@gmail.com",
                    username: "juancitomastro"
                }]
            });
        });
    });


    describe('POST /users', () => {
        it('should return a user id', async() => {
            await signup(agent, {
                name: "Rita Segato",
                email: "laGranRita@gmail.com",
                username: "laritadelpueblo",
                password: "sevaacaer"
            });

            assert.deepEqual(getUserId(), 1);
            assert.isNotNull(getToken());
        });
    });

    describe('GET /users/:id', () => {
        it('should return a singleton list whith an specific user', async() => {
            await signup(agent, {
                name: "Judith Butler",
                email: "queer@gmail.com",
                username: "buttlerxxx",
                password: "sevaacaer"
            });
            const userId = getUserId();
            const res = await withToken(agent.get(`/users/${userId}`))
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                id: userId,
                name: "Judith Butler",
                email: "queer@gmail.com",
                username: "buttlerxxx"
            });
        });

    });

    describe('PUT /users/:id', () => {
        it('should return a 200 status after making a PUT', async() => {
            await signup(agent, {
                name: "Simone De beauvoir",
                email: "broken@gmail.com",
                username: "simonDice",
                password: "sevaacaer"
            });
            const userId = getUserId();
            const res = await withToken(agent.put(`/users/${userId}`)).send({ name: "Simone De beauvoir", email: "broken@yahoo.com" })
            assert.equal(res.status, 200);

            const newres = await withToken(agent.get(`/users/${userId}`))
            assert.equal(newres.status, 200);
            assert.deepEqual(newres.body, {
                id: userId,
                name: "Simone De beauvoir",
                username: "simonDice",
                email: "broken@yahoo.com"
            });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should return an empty list after deleting a user', async() => {
            await signup(agent, {
                name: "Robert Machi",
                email: "patriarcado@gmail.com",
                username: "onvre",
                password: "lapetisa"
            });

            const res = await withToken(agent.delete(`/users/${getUserId()}`))
            assert.equal(res.status, 200);

            const newres = await withToken(agent.get('/users'))
            assert.equal(newres.status, 200);
            assert.deepEqual(newres.body, { users: [] });
        });
    });
});
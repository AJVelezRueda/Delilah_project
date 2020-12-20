process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const user = require('../controllers/user');
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Users', () => {
    beforeEach(async () => await user.clean());
    describe('GET /users', () => {
        it('should return an empty list when there are no users', async () => {
            const res = await agent.get('/users')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { users: [] });
        });

        it('should return a singleton list when there is an user recently created', async () => {
            await agent.post('/users').send({ name: "Johan Sebastian", email: "mastro@gmail.com" })
            const res = await agent.get('/users')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                users: [{ id: 1, name: "Johan Sebastian", email: "mastro@gmail.com" }]
            });
        });
    });


    describe('POST /users', () => {
        it('should return a user id', async () => {
            const {body} = await agent.post('/users').send({ name: "Rita Segato", email: "laGranRita@gmail.com" })
            const userId = body.id;

            assert.equal(userId, 1);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a singleton list whith an specific user', async () => {
            const {body} = await agent.post('/users').send({ name: "Judith Butler", email: "queer@gmail.com" })
            const userId = body.id;
            const res = await agent.get(`/users/${userId}`)
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                id: userId,
                name: "Judith Butler",
                email: "queer@gmail.com"
            });
        });

    });

    describe('POST /users/:id', () => {
        it('should return a singleton list whith an specific user', async () => {
            const {body} = await agent.post('/users').send({ name: "Simone De beauvoir", email: "broken@gmail.com" })
            const userId = body.id;
            const res = await agent.get(`/users/${userId}`)
            assert.equal(res.status, 200);
        });

    });



    describe('DELETE /users/:id', () => {
        it('should delete a user', async () => {
            const {body} = await agent.post('/users').send({ name: "Robert Machi", email: "patriarcado@gmail.com" })
            const userId = body.id;
            const res = await agent.get(`/users/${userId}`)
            assert.equal(res.status, 200);
        });
    });
});
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const user = require('../controllers/user');
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Users', () => {
    beforeEach(async() => await user.clean());
    afterEach(async() => await user.clean());
    describe('GET /users', () => {
        it('should return an empty list when there are no users', async() => {
            const res = await agent.get('/users')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { users: [] });
        });

        it('should return a singleton list when there is an user recently created', async() => {
            await agent.post('/users').send({
                name: "Johan Sebastian",
                email: "mastro@gmail.com",
                username: "juancitomastro",
                password: "sevaacaer"
            })
            const res = await agent.get('/users')
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
            const { body } = await agent.post('/users').send({
                name: "Rita Segato",
                email: "laGranRita@gmail.com",
                username: "laritadelpueblo",
                password: "sevaacaer"
            })

            assert.deepEqual(body.id, 1);
            assert.isNotNull(body.token);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a singleton list whith an specific user', async() => {
            const { body } = await agent.post('/users').send({
                name: "Judith Butler",
                email: "queer@gmail.com",
                username: "buttlerxxx",
                password: "sevaacaer"
            })
            const userId = body.id;
            const res = await agent.get(`/users/${userId}`)
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
            const { body } = await agent.post('/users').send({
                name: "Simone De beauvoir",
                email: "broken@gmail.com",
                username: "simonDice",
                password: "sevaacaer"
            })
            const userId = body.id;
            const res = await agent.put(`/users/${userId}`).send({ name: "Simone De beauvoir", email: "broken@yahoo.com" })
            assert.equal(res.status, 200);

            const newres = await agent.get(`/users/${userId}`)
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
            const { body } = await agent.post('/users').send({
                name: "Robert Machi",
                email: "patriarcado@gmail.com",
                username: "onvre",
                password: "lapetisa"
            })
            const userId = body.id;
            const res = await agent.delete(`/users/${userId}`)
            assert.equal(res.status, 200);

            const newres = await agent.get('/users')
            assert.equal(newres.status, 200);
            assert.deepEqual(newres.body, { users: [] });
        });
    });
});
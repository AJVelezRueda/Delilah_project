process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const orders = require('../controllers/orders');
const user = require('../controllers/user');
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Orders', () => {
    beforeEach(async() => await products.clean());
    beforeEach(async() => await orders.clean());
    beforeEach(async() => await user.clean());

    afterEach(async() => await products.clean());
    afterEach(async() => await orders.clean());
    afterEach(async() => await user.clean());

    describe('GET /orders', () => {
        it('should return an empty list when there are no orders', async() => {
            const res = await agent.get('/orders')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { orders: [] });
        });

        it('should return a singleton list when there is an order recently created', async() => {
            const { body: bodyUser } = await agent.post('/users').send({ name: "Pendorcho Flores", email: "elFlores@gmail.com" });
            const user_id = bodyUser.id;

            await agent.post('/orders').send({
                user_id: user_id,
                description: "veggie",
                address: "calle falsa 123",
                payment_method: "cash"
            })
            const res = await agent.get('/orders')

            assert.deepEqual(res.body, {
                orders: [{
                    id: 1,
                    status: 'nuevo',
                    user_id: user_id,
                    description: "veggie",
                    address: "calle falsa 123",
                    payment_method: "cash"
                }]
            });
        });


        it('should return a singleton list when there is an order recently created', async() => {
            const { body: bodyUser } = await agent.post('/users').send({ name: "Pendorcho Flores", email: "elFlores@gmail.com" })
            const user_id = bodyUser.id;

            const { body } = await agent.post('/orders').send({
                user_id: user_id,
                item_id: item_id,
                description: "veggie",
                address: "calle falsa 123",
                payment_method: "cash"
            });

            assert.deepEqual(body, { id: 1 })
        });
    });
});
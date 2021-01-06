process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const orders = require('../controllers/orders');
const user = require('../controllers/user');
const products = require('../controllers/products');
chai.use(chaiHttp);

const { getUserId, withToken, signup } = require("./setup");

const agent = chai.request.agent(server);

describe('Orders', () => {
    beforeEach(async() => await orders.clean());
    beforeEach(async() => await user.clean());
    beforeEach(async() => await products.clean());

    afterEach(async() => await orders.clean());
    afterEach(async() => await user.clean());
    afterEach(async() => await products.clean());

    beforeEach(async() => await signup(agent));

    async function orderABrownie() {
        const { body: { id: product_id } } = await withToken(agent.post('/products')).send({
            name: "Brownie relleno",
            price: "150.00"
        });
        const result = await withToken(agent.post('/orders'))
            .send({
                items: [{ product_id, cantidad: 3 }],
                description: "veggie",
                address: "calle falsa 123",
                payment_method: "cash"
            });
        assert.isNotNull(result.body.id);
        assert.deepEqual(result.status, 201);
        return { product_id };
    }

    describe('GET /orders', () => {
        it('should return an empty list when there are no orders', async() => {
            const res = await withToken(agent.get('/orders'))
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { orders: [] });
        });

        it('should return all the orders created', async() => {
            await orderABrownie();

            const res = await withToken(agent.get('/orders'))
            assert.deepEqual(res.body, {
                orders: [{
                    id: 1,
                    status: 'new',
                    user_id: getUserId(),
                    description: "veggie",
                    address: "calle falsa 123",
                    payment_method: "cash"
                }]
            });
        });
    });

    describe('GET /orders/:id', () => {
        it('should return an order recently created', async() => {
            const { product_id } = await orderABrownie();

            const res = await withToken(agent.get('/orders/1'))
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                id: 1,
                status: 'new',
                user_id: getUserId(),
                items: [{ id: product_id, cantidad: "3.00", name: "Brownie relleno" }],
                description: "veggie",
                address: "calle falsa 123",
                payment_method: "cash"
            });
        });
    });

    describe('PUT /orders/:id', () => {
        it('should return an order recently created', async() => {
            const { product_id } = await orderABrownie();

            const res = await withToken(agent.get('/orders/1'))
            assert.equal(res.status, 200);


            const newres = await withToken(agent.put('/orders/1')).send({
                items: [{ product_id, cantidad: 3 }],
                description: "sin sal",
                address: "calle falsa 123",
                payment_method: "cash",
                status: "done"
            });

            assert.deepEqual(newres.body, {});
            assert.deepEqual(newres.status, 200);
        });
    });

    describe('DELETE /orders/:id', () => {
        it('should return 200 status afeter deleting an order', async() => {
            await orderABrownie();

            const res = await withToken(agent.delete(`/orders/1`));
            assert.equal(res.status, 200);

            const newres = await withToken(agent.get('/orders'));
            assert.equal(newres.status, 200);
        });
    });
});
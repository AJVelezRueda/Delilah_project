process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const orders = require('../controllers/orders');
const user = require('../controllers/user');
const products = require('../controllers/products');
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Orders', () => {
    beforeEach(async() => await orders.clean());
    beforeEach(async() => await user.clean());
    beforeEach(async() => await products.clean());

    afterEach(async() => await orders.clean());
    afterEach(async() => await user.clean());
    afterEach(async() => await products.clean());


    async function orderABrownie() {
        const { body: bodyUser } = await agent.post('/users').send({ name: "Pendorcho Flores", email: "elFlores@gmail.com" });
        const user_id = bodyUser.id;

        const { body: bodyProducts } = await agent.post('/products').send({ name: "Brownie relleno", price: "150.00" });
        const product_id = bodyProducts.id;

        await agent.post('/orders').send({
            user_id: user_id,
            items: [{ product_id, cantidad: 3 }],
            description: "veggie",
            address: "calle falsa 123",
            payment_method: "cash"
        });

        return { user_id, product_id };
    }

    describe('GET /orders', () => {
        it('should return an empty list when there are no orders', async() => {
            const res = await agent.get('/orders')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { orders: [] });
        });

        it('should return a singleton list when there is an order recently created', async() => {
            const { user_id } = await orderABrownie();

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
    });

    describe('GET /orders/:id', () => {
        it('should return a singleton list when there is an order recently created', async() => {
            const { user_id, product_id } = await orderABrownie();

            const res = await agent.get('/orders/1')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                id: 1,
                status: 'nuevo',
                user_id: user_id,
                items: [{ id: product_id, cantidad: "3.00", name: "Brownie relleno" }],
                description: "veggie",
                address: "calle falsa 123",
                payment_method: "cash"
            });
        });
    });

    describe('DELETE /orders/:id', () => {
        it('should return a singleton list when there is an order recently deleted', async() => {
            await orderABrownie();

            const res = await agent.delete(`/orders/1`);
            assert.equal(res.status, 200);

            const newres = await agent.get('/orders')
            assert.equal(newres.status, 200);
        });
    });
});
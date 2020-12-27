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
    beforeEach(async() => await products.clean());
    beforeEach(async() => await orders.clean());
    beforeEach(async() => await user.clean());

    describe('GET /orders', () => {
        it('should return an empty list when there are no orders', async() => {
            const res = await agent.get('/orders')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { orders: [] });
        });

        it('should return a singleton list when there is an order recently created', async() => {
            const { bodyProduct } = await agent.post('/products').send({ name: "Tamales", price: "250.00" })
            const productId = bodyProduct.id;
            const resProd = await agent.get(`/products/${productId}`)

            assert.equal(resProd.status, 200);
            assert.deepEqual(resProd.bodyProduct, {
                id: productId,
                name: "Tamales",
                price: "250.00"
            });

            const { bodyuser } = await agent.post('/users').send({ name: "Rita Segato", email: "laGranRita@gmail.com" })
            const userId = bodyuser.id;

            assert.equal(userId, 1);

            await agent.post('/orders').send({ user_id: userId, product_id: productId, description: "veggie", address: "calle falsa 123", payment_method: "efectivo" })
            const res = await agent.get('/orders')

            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                orders: [{ id: 1, status: 'nuevo', user_id: userId, product_id: productId, description: "veggie", address: "calle falsa 123", payment_method: "efectivo" }]
            });
        });
    });
});
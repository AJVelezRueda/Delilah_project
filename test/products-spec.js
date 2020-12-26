process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const products = require('../controllers/products');
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Products', () => {
    beforeEach(async () => await products.clean());
    describe('GET /products', () => {
        it('should return an empty list when there are no products', async () => {
            const res = await agent.get('/products')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { products: [] });
        });

        it('should return a singleton list when there is an product recently created', async () => {
            await agent.post('/products').send({ name: "Gulash", price: "150.00" })
            const res = await agent.get('/products')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                products: [{ id: 1, name: "Gulash", price: "150.00" }]
            });
        });
    });
});
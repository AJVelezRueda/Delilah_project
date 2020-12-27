process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;
const products = require('../controllers/products');
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Products', () => {
    beforeEach(async() => await products.clean());
    afterEach(async() => await products.clean());

    describe('GET /products', () => {
        it('should return an empty list when there are no products', async() => {
            const res = await agent.get('/products')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { products: [] });
        });

        it('should return a singleton list when there is an product recently created', async() => {
            await agent.post('/products').send({ name: "Gulash", price: "150.00" })
            const res = await agent.get('/products')
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                products: [{ id: 1, name: "Gulash", price: "150.00" }]
            });
        });
    });

    describe('POST /products', () => {
        it('should return a product id', async() => {
            const { body } = await agent.post('/products').send({ name: "Brownie relleno", price: "150.00" })

            assert.deepEqual(body, { id: 1 });
        });
    });

    describe('GET /products/:id', () => {
        it('should return a singleton list whith an specific product', async() => {
            const { body } = await agent.post('/products').send({ name: "Carbonada", price: "250.00" })
            const productId = body.id;
            const res = await agent.get(`/products/${productId}`)

            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                id: productId,
                name: "Carbonada",
                price: "250.00"
            });
        });
    });

    describe('PUT /products/:id', () => {
        it('should return a singleton list whith an specific product after updating the data', async() => {
            const { body } = await agent.post('/products').send({ name: "Hamburguesa completa", price: "450.00" })
            const productId = body.id;
            const res = await agent.put(`/products/${productId}`).send({ name: "Hamburguesa completa", price: "350.00" })
            assert.equal(res.status, 200);

            const newres = await agent.get(`/products/${productId}`)

            assert.equal(newres.status, 200);
            assert.deepEqual(newres.body, {
                id: productId,
                name: "Hamburguesa completa",
                price: "350.00"
            });
        });
    });

    describe('DELETE /products/:id', () => {
        it('should return 200 status after deleting a product', async() => {
            const { body } = await agent.post('/products').send({ name: "Flan", price: "150.00" })
            const productId = body.id;

            const res = await agent.delete(`/products/${productId}`);
            assert.equal(res.status, 200);

            const newres = await agent.get('/products');

            assert.equal(newres.status, 200);
            assert.deepEqual(newres.body, { products: [] });
        });
    });
});
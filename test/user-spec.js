process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let assert = chai.assert;
chai.use(chaiHttp);

let agent = chai.request.agent(server);

describe('Users', () => {
    describe('GET /users', () => {
        it('should return an empty list when there are no users', (done) => {
            agent
                .get('/users')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { users: [] });
                    done();
                });
        });

        it('should return a singleton list when there is an user', (done) => {
            agent
                .post('/users')
                .send({ name: "Johan Sebastian", email: "mastro@gmail.com" })
                .end(() =>
                    agent.get('/users').end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body, {
                            users: [{ id: 1, name: "Johan Sebastian", email: "mastro@gmail.com" }]
                        });
                        done();
                    }));
        });
    });
});
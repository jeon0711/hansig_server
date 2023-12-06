const app = require('../app')
const request = require('supertest')

describe('GET /hansic is ...', function () {
    this.timeout(10000)
    describe('success', async () => {
        it('return data', async () => {
            request(app)
                .get('/hansic')
                .end(async (err, res) => {

                    //console.log(res.body)
                    res.body.should.be.instanceOf(Array)
                    //done();


                })
        })
    })
})

describe('post /user is..', function () {
    describe('success', () => {
        let body = {
            name: 'test',
            age: 5
        }
        it('201으로 응답한다', (done) => {
            request(app)
                .post('/users')
                .send(body)
                .expect(201)
                .end(done)
        }); 

    });
})
//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../../RESTAPI');
chai.should();

chai.use(chaiHttp);

/*
 * Test the /Post route /post /user/signup
 */
describe('/POST /user/signup', () => {
    it('it should SIGNUP the user', (done) => {
        let user = {
            userName: "test",
            email: "test1@gmail.com",
            firstName: "test",
            lastName: "1",
            dateOfBirth: "10-20-1995",
            password: "12345",
            skills: "any",
            country: "India"
        }
        chai.request(server)
            .post('/api/user/signup')
            .set('Accept', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('message').eql('success');
                res.body.should.have.property('response');
                res.body.should.have.property('userName');
                res.body.userName.should.be.a('string');
                res.body.should.have.property('email');
                res.body.email.should.be.a('string');
                res.body.should.have.property('firstName');
                res.body.firstName.should.be.a('string');
                res.body.should.have.property('lastName');
                res.body.lastName.should.be.a('string');
                res.body.should.have.property('dateOfBirth');
                res.body.dateOfBirth.should.be.a('string');
                res.body.should.have.property('password');
                res.body.password.should.be.a('string');
                res.body.should.have.property('skills');
                res.body.skills.should.be.a('string');
                res.body.should.have.property('country');
                res.body.country.should.be.a('string');
                done();
            });
    });
});

/*
 * Test the /Post route /POST /user
 */
describe('/POST /user/login', () => {
    it('it should LOGIN the user', (done) => {
        let user = {
            email: 'test123@gmail.com',
            password: '12345'
        }
        chai.request(server)
            .post('/api/user/login')
            .set('Accept', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('message').eql('success');
                res.body.should.have.property('response');
                res.body.should.have.property('email');
                res.body.email.should.be.a('string');
                res.body.should.have.property('password');
                res.body.password.should.be.a('string');
                done();
            });
    });
});

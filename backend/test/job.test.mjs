import { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';  // Ensure the correct path and file extension

chai.use(chaiHttp);

describe('Job API', () => {
  it('should get all jobs', (done) => {
    chai.request(app)
      .get('/jobs')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new job', (done) => {
    chai.request(app)
      .post('/jobs')
      .send({
        contractId: '12345',
        owner: 'ownerId',
        title: 'New Job',
        description: 'Job description',
        budget: 1000,
        duration: '1 month',
        skills: ['JavaScript', 'Node.js']
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', 'New Job');
        done();
      });
  });

  // Add more tests for other endpoints
});

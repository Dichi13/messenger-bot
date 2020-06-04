const chai = require('chai'),
  chaiHttp = require('chai-http'),
  env = require('dotenv').config({ path: '../.env' })
  app = require('../index')

chai.use(chaiHttp)
chai.should()

describe("Webhook endpoint test", () => {
  describe("GET /webhook", () => {
    it("should pass the token verification", (done) => {
      const verifyToken = process.env.VERIFY_TOKEN
      chai.request(app)
        .get(`/webhook?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=randomString`)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })

    it("should not pass the token verification", (done) => {
      chai.request(app)
        .get('/webhook?hub.mode=a&hub.verify_token=b&hub.challenge=randomString')
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })

    it("should not be able to verify", (done) => {
      chai.request(app)
        .get('/webhook')
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

  describe("POST /webhook", () => {
    it("should be able to receive event", (done) => {
      chai.request(app)
        .post(`/webhook`)
        .set('content-type', 'application/json')
        .send({object: 'page', entry: []})
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })

    it("should not be able to receive event", (done) => {
      chai.request(app)
        .post(`/webhook`)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})
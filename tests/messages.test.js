const chai = require('chai'),
  chaiHttp = require('chai-http'),
  app = require('../index')

chai.use(chaiHttp)
chai.should()

describe("Messages endpoint test", () => {
  describe("GET /messages", () => {
    it("should get all messages", (done) => {
      chai.request(app)
        .get('/messages')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })
    })

    // Please take note that the data stored is not persistent, so it should always return 404
    it("should not get a single message", (done) => {
      const id = 1
      chai.request(app)
        .get(`/messages/${id}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          done()
        })
    })
  })

  describe("POST /messages", () => {

    // The same goes with this
    it("should not delete any message", (done) => {
      const id = 1
      chai.request(app)
        .post(`/messages/delete`)
        .set('content-type', 'application/json')
        .send({messageId: id})
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          done()
        })
    })
  })
})
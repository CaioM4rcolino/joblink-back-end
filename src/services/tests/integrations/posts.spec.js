const request = require("supertest");
const app = require("../../../app");
const connection = require("../../../config/database")
const {cpf} = require("cpf-cnpj-validator")


describe("Posts", () => {

    var token = null;

    beforeAll(function(done) {
        request(app)
          .post('/sessions')
          .send({
              email: "ricardomedeiros@gmail.com",
              password: "ricardomedeiros"
          })
          .end(function(err, res) {
            token = res.body.token; // Or something
            done();
          });
      });

    

    afterAll(()=>{
        connection.close();
    })

    it("should create post", async () => {

        const response = await request(app).post("/posts").set('Authorization', 'Bearer ' + token).send({
            title: "presto serviços de contabilidade",
            description: "sou formado em contabilidade e faço declarações de impostos de renda, finanças domésticas e empresariais, trabalho de diarista e contas bancárias",
            urgency: 5,
            category: "8",
            attendance: "false",
            is_announcement: "true"
        })

        //console.log("Ó a categoria:", response.body.post)

        expect(response.body).toHaveProperty("Status")
        expect(response.body).toHaveProperty("post")
        expect(response.body.post.category).toBeFalsy();
        expect(response.body.post).toHaveProperty("author", "title", "description")
    })
    
})
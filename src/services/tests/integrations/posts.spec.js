const request = require("supertest");
const app = require("../../../app");
const connection = require("../../../config/database")
const {cpf} = require("cpf-cnpj-validator")


describe("Posts", () => {

    // var token = null;

    // beforeAll(function(done) {
    //     request(app)
    //       .post('/sessions')
    //       .send({
    //           email: "ricardomedeiros@gmail.com",
    //           password: "ricardomedeiros"
    //       })
    //       .end(function(err, res) {
    //         token = res.body.token; // Or something
    //         done();
    //       });
    //   });

    

    afterAll(()=>{
        connection.close();
    })

    it("should create post", async () => {

        const response1 = await request(app).post("/freelancers").send({
            name: "Ricardo Medeiros",
            gender: "Masculino", 
            birth_date: "12/03/1980",
            email: "ricardomedeiros@gmail.com",
            password: "ricardomedeiros",
            profession: "5",
            years_experience: "20 anos",
            cpf: cpf.generate(),
            address: "Avenida Panamericana, Danúbio do Sul"
        })

        const response2 = await request(app).post("/posts").set('Authorization', 'Bearer ' + response1.body.token).send({
            title: "presto serviços de contabilidade",
            description: "sou formado em contabilidade e faço declarações de impostos de renda, finanças domésticas e empresariais, trabalho de diarista e contas bancárias",
            urgency: 5,
            category: "8",
            attendance: "false",
            is_announcement: "true"
        })

        //console.log("Ó a categoria:", response.body.post)

        expect(response2.body).toHaveProperty("Status")
        expect(response2.body).toHaveProperty("post")
        expect(response2.body.post.category).toBeFalsy();
        expect(response2.body.post).toHaveProperty("author", "title", "description")
    })
    
})
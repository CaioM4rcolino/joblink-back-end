const request = require("supertest");
const app = require("../../../app");
const connection = require("../../../config/database");
const truncate = require("./truncate");
const {cpf} = require("cpf-cnpj-validator")

describe("Freelancers", () => {

    // beforeEach(async (done) => {
    //     await truncate(connection.models)
    //     done();
    // })

    afterAll(()=>{
        connection.close();
    })

    it("should create a freelancer", async () => {
        const response = await request(app).post("/freelancers").send({
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

        //console.log("Ó o freelancer", response.body.freelancer)

        expect(201).toBeTruthy()
        expect(response.body).toHaveProperty("freelancer")
        expect(response.body).toHaveProperty("token")
        expect(response.body.freelancer.cpf).toHaveLength(11)
    })
})
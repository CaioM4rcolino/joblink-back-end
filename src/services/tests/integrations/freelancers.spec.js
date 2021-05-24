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
            name: "Cleiton Neves",
            gender: "Masculino", 
            birth_date: "22/01/1981",
            email: "cleitonneves@gmail.com",
            password: "cleitonneves",
            profession: "1",
            years_experience: "10 anos",
            cpf: cpf.generate(),
            address: "Avenida Jaraquara, Dakota Brasileira"
        })

        //console.log("Ó o freelancer", response.body.freelancer)

        expect(201).toBeTruthy()
        expect(response.body).toHaveProperty("freelancer")
        expect(response.body).toHaveProperty("token")
        expect(response.body.freelancer.cpf).toHaveLength(11)
    })
})
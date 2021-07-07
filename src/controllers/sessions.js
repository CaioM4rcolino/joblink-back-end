const Client = require("../models/Client");
const User = require("../models/User");
const Freelancer = require("../models/Freelancer");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils");

module.exports = {
  async store(req, res) {
    const { email, password } = req.body;

    try {
      let token = "";

      const client = await User.findOne({
        where: {
          email,
          is_freelancer: 0,
        },
      });

      const freelancer = await User.findOne({
        where: {
          email,
          is_freelancer: 1,
        },
      });

      if (!client || !bcrypt.compareSync(password, client.password)) {
        if (!freelancer || !bcrypt.compareSync(password, freelancer.password)) {
          return res
            .status(403)
            .send({ error: "Usuário e/ou senha inválidos" });
        } else {
          token = generateToken({
            freelancerId: freelancer.id,
            freelancerName: freelancer.name,
          });

          res.status(201).send({
            freelancer: {
              id: freelancer.id,
              name: freelancer.name,
              email: freelancer.email,
              birth_date: freelancer.birth_date,
              cpf: freelancer.cpf,
              years_experience: freelancer.years_experience,
              history: freelancer.history,
              rating: freelancer.rating,
              image: freelancer.image,
            },

            token,
          });
        }
      } else {
        token = generateToken({ clientId: client.id, clientName: client.name });

        res.status(201).send({
          client: {
            id: client.id,
            name: client.name,
            email: client.email,
            birth_date: client.birth_date,
            cpf: client.cpf,
            image: client.image,
          },

          token,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};

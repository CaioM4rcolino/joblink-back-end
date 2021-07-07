const { getPayload } = require("../utils");
const Service = require("../models/Service");
const { Op } = require("sequelize");

module.exports = {
  async index(req, res) {
    const payload = getPayload(req);
    const idUser = Object.values(payload)[0];
    //const payloadKeys = Object.keys(payload)[0];

    try {
      const whereUserIsFreelancer = await Service.findAll({
        where: {
          id_user: {
            [Op.not]: idUser,
          },
          is_accepted: false,
          id_freelancer: idUser,
        },
        include: [
          {
            association: "Post",
            attributes: ["id", "description"],
            include: {
              association: "User",
              attributes: ["id", "name", "image"],
            },
          },
        ],
      });

      const whereUserIsPostOwner = await Service.findAll({
        where: {
          id_user: {
            [Op.not]: idUser,
          },
        },
        include: [
          {
            association: "Post",
            attributes: ["id", "description"],
            where: {
              user_id: idUser,
            },
          },
          {
            association: "User",
            attributes: ["id", "name", "image"],
          },
        ],
      });

      if (
        whereUserIsFreelancer.length != 0 ||
        whereUserIsPostOwner.length != 0
      ) {
        res.status(200).send({
          pendencies: {
            whereUserIsFreelancer,
            whereUserIsPostOwner,
          },
        });
      } else {
        res.status(200).send({ No_Results: "Você não tem notificações." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};

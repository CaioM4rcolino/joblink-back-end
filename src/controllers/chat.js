const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { getPayload, validateModel } = require("../utils");
const Service = require("../models/Service");
const Post = require("../models/Post");
const User = require("../models/User");
const { Op } = require("sequelize");

module.exports = {
  async index(req, res) {
    const payload = getPayload(req);
    const idUser = Object.values(payload)[0];

    try {
      let query1 = await Chat.findAll({
        attributes: ["id", "created_at", "updated_at"],
        include: {
          association: "Service",
          where: {
            [Op.or]: [{ id_user: idUser }, { id_freelancer: idUser }],
          },
          include: [
            {
              association: "User",
              attributes: ["id", "name", "image"],
            },
            {
              association: "Freelancer",
              attributes: ["id", "name"],
            },
            {
              association: "Post",
              attributes: ["id", "title", "description", "is_announcement"],

              include: {
                association: "User",
                attributes: ["id", "name", "image"],
              },
            },
          ],
        },
      });

      let query2 = await Chat.findAll({
        attributes: ["id", "created_at", "updated_at"],
        include: {
          association: "Service",
          include: [
            {
              association: "Post",
              attributes: ["id", "title", "description", "is_announcement"],
              where: {
                user_id: idUser,
              },
              include: {
                association: "User",
                attributes: ["id", "name", "image"],
              },
            },
            {
              association: "User",
              attributes: ["id", "name", "image"],
            },
            {
              association: "Freelancer",
              attributes: ["id", "name"],
            }
          ],
        },
      });

      if (query1.length != 0 || query2.length != 0) {
        function verifyService(chat) {
          if (chat.Service != null) {
            return chat;
          }
        }

        let queryChatsByService = query1.filter(verifyService);
        let queryChatsByPosts = query2.filter(verifyService);

        //return console.log(queryChatByPosts)

        return res.status(200).send({
          queryChatsByService,
          queryChatsByPosts,
        });
      } else {
        return res
          .status(200)
          .send({ No_results: "0 resultados encontrados." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  async find(req, res) {
    const idChat = req.params.id;

    try {
      const chats = await Chat.findAll({
        where: { id: idChat },
        attributes: ["id", "created_at", "updated_at"],
        include: {
          association: "Service",
          include: [
            {
              association: "User",
              attributes: ["id", "name", "image"],
            },
            {
              association: "Freelancer",
              attributes: ["id", "name"],
            },
            {
              association: "Post",
              attributes: ["id", "title", "description", "is_announcement"],
              include: {
                association: "User",
                attributes: ["id", "name", "image"],
              },
            },
          ],
        },
      });

      if (chats.length == 0) {
        return res.status(404).send({ No_results: "0 chats encontrados." });
      }

      res.status(200).send(chats);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  async store(req, res) {
    const idService = req.params.id;

    try {
      const verifyChats = await Chat.findAll({
        where: {
          id_service: idService,
        },
      });

      if (verifyChats.length != 0) {
        return res
          .status(401)
          .send({ Unauthorized: "J?? existe um chat para este servi??o." });
      }

      const service = await validateModel(res, idService, Service, "Servi??o");
      const post = await validateModel(res, service.id_post, Post, "Postagem");

      let idClient = "";
      let idFreelancer = "";

      //caso de requisi????es bilaterais (cliente para freelancer ou freelancer para cliente)
      if (post.user_id !== service.id_user) {
        //determinar se o usu??rio no servi??o ?? cliente ou freelancer
        if (service.is_from_client == 1) {
          idClient = service.id_user;
          idFreelancer = post.user_id;
        } else if (service.is_from_client == 0) {
          idClient = post.user_id;
          idFreelancer = service.id_user;
        }
      } else {
        idClient = service.id_user;
        idFreelancer = service.id_freelancer;
      }

      if (service.progress == 1) {
        await Chat.create({ id_service: service.id });
        await service.update({
          is_accepted: 1,
        });
      } else {
        return res
          .status(401)
          .send({ Error: "Esse servi??o j?? foi terminado." });
      }

      const client = await validateModel(res, idClient, User, "Cliente");
      const freelancer = await validateModel(
        res,
        idFreelancer,
        User,
        "Freelancer"
      );

      res.status(200).send({
        Success: "Chat criado com sucesso.",
        Involved: {
          client: {
            id: client.id,
            name: client.name,
          },
          freelancer: {
            id: freelancer.id,
            name: freelancer.name,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};

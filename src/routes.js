const express = require('express');
const routes = express.Router();

const authMiddleware = require("./middleware/authorization");

const middlewareClients = require('./middleware/clients');
const middlewareFreelancers = require('./middleware/freelancers')
const middlewarePosts = require('./middleware/posts')
const uploadFirebase = require('./services/uploadFirebase');
const multerValidator = require('./middleware/multerValidator');

const controllerFreelancers = require('./controllers/freelancers');
const controllerClients = require('./controllers/clients');
const controllerPosts = require('./controllers/posts');
const controllerSessions = require('./controllers/sessions')
const controllerSearching = require('./controllers/searching')
const controllerFeed = require('./controllers/feed');
const controllerServices = require('./controllers/services');
const controllerPayment = require('./controllers/payments');
const controllerProfessions = require('./controllers/professions')

const mercadoPagoApi = require('./services/testPreference');

//rotas públicas
routes.post("/sessions", controllerSessions.store);
routes.post("/clients", multerValidator, middlewareClients.create, uploadFirebase, controllerClients.store);
routes.post("/freelancers", multerValidator, middlewareFreelancers.create, uploadFirebase, controllerFreelancers.store);
routes.get("/search", controllerSearching.find)


//middleware que verifica o token
routes.use(authMiddleware);

//rota do feed de postagens
routes.get("/feed", controllerFeed.index);

//rota de clientes
routes.get("/clients", controllerClients.index);
routes.get("/clients/:id", controllerClients.find)
routes.put("/clients", middlewareClients.update, controllerClients.update);
routes.delete("/clients", controllerClients.delete);

//rota de freelancers
routes.get("/freelancers", controllerFreelancers.index);
routes.get("/freelancers/:id", controllerFreelancers.find)
routes.put("/freelancers", middlewareFreelancers.update, controllerFreelancers.update);
routes.delete("/freelancers", controllerFreelancers.delete);


//rota de postagem
routes.get("/posts", controllerPosts.index);
routes.post("/posts", multerValidator, middlewarePosts.create, uploadFirebase, controllerPosts.store);
routes.put("/posts/:id", middlewarePosts.update, controllerPosts.update);
routes.delete("/posts/:id", controllerPosts.delete);

//rota de serviços
routes.get("/services", controllerServices.index);
routes.post("/posts/:idPost/service", controllerServices.store);
//TODO: cliente dono da postagem e dono do token
routes.post("/posts/:idPost/freelancer/:idFreelancer/service", controllerServices.store);
routes.delete("/posts/:idPost/service/:id", controllerServices.delete);

//setar preço do serviço (só para o freelancer)
routes.put("/posts/:idPost/service/:id", controllerServices.update)

//rota de pagamento (só para o cliente)
routes.put("/payment/services/:id", controllerPayment.store);

//rota teste de preferencia 
routes.post("/create_preference", mercadoPagoApi.createPreference);

//rota de profissões
routes.get("/professions", controllerProfessions.index)
routes.get("/professions/:id", controllerProfessions.find)

module.exports = routes;
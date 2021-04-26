const express = require('express');
const routes = express.Router();

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

//rota pública de login (session)
routes.post("/sessions", controllerSessions.store);

//rota de pesquisa
routes.get("/search", controllerSearching.find)

//rota do feed de postagens
routes.get("/feed", controllerFeed.index);

//rota de clientes
routes.get("/clients", controllerClients.index);
routes.get("/clients/:id", controllerClients.find)
routes.post("/clients", multerValidator, middlewareClients.create, uploadFirebase, controllerClients.store);
routes.put("/clients/:id", middlewareClients.update, controllerClients.update);
routes.delete("/clients/:id", controllerClients.delete);

//rota de freelancers
routes.get("/freelancers", controllerFreelancers.index);
routes.get("/freelancers/:id", controllerFreelancers.find)
routes.post("/freelancers", multerValidator, middlewareFreelancers.create, uploadFirebase, controllerFreelancers.store);
routes.put("/freelancers/:id", middlewareFreelancers.update, controllerFreelancers.update);
routes.delete("/freelancers/:id", controllerFreelancers.delete);


//rota de postagem
routes.get("/posts", controllerPosts.index);
routes.post("/posts/:id", multerValidator, middlewarePosts.create, uploadFirebase, controllerPosts.store);
routes.put("/posts/:id", middlewarePosts.update, controllerPosts.update);
routes.delete("/posts/:id", controllerPosts.delete);

//rota de requisições de serviços
routes.post("/services/toFreelancer/:idPost/:idFreelancer", controllerServices.store);
routes.post("/services/toClient/:idFreelancer/:idPost", controllerServices.store);


module.exports = routes;
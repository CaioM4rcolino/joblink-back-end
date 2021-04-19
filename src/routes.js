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

//rota pública de login (session)
routes.post("/sessions", controllerSessions.store);


routes.get("/clients", controllerClients.index);
routes.get("/clients/:id", controllerClients.find)
routes.post("/clients", middlewareClients.create, controllerClients.store);
routes.put("/clients/:id", middlewareClients.update, controllerClients.update);
routes.delete("/clients/:id", controllerClients.delete);

routes.get("/freelancers", controllerFreelancers.index);
routes.get("/freelancers/:id", controllerFreelancers.find)
routes.post("/freelancers", middlewareFreelancers.create,controllerFreelancers.store);
routes.put("/freelancers/:id", middlewareFreelancers.update, controllerFreelancers.update);
routes.delete("/freelancers/:id", controllerFreelancers.delete);

routes.get("/posts", controllerPosts.index);
routes.post("/posts/:id", multerValidator, uploadFirebase, middlewarePosts.create, controllerPosts.store);
routes.put("/posts/:id", middlewarePosts.update, controllerPosts.update);
routes.delete("/posts/:id", controllerPosts.delete);

module.exports = routes;
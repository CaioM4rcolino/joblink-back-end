const express = require('express');
const routes = express.Router();


const controllerClients = require('./controllers/clients');
const middlewareClients = require('./middleware/clients')

const controllerFreelancers = require('./controllers/freelancers');
const middlewareFreelancers = require('./middleware/freelancers')

const controllerSessions = require('./controllers/sessions')

//rota pública de login (session)
routes.post("/sessions", controllerSessions.store);


routes.get("/clients", controllerClients.index);
routes.get("/clients/:id", controllerClients.find)
routes.post("/clients", middlewareClients.create,controllerClients.store);
routes.delete("/clients/:id");
routes.put("/clients/:id");

routes.get("/freelancers", controllerFreelancers.index);
routes.get("/freelancers/:id", controllerFreelancers.find)
routes.post("/freelancers", middlewareFreelancers.create,controllerFreelancers.store);
routes.put("/freelancers/:id");
routes.delete("/freelancers/:id");

module.exports = routes;
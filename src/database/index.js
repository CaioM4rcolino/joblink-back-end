const Sequelize = require("sequelize");
const dbConfig = require('../config/database');

const Client = require("../models/Client");
const Freelancer = require("../models/Freelancer");

const connection = new Sequelize(dbConfig);

Client.init(connection);
Freelancer.init(connection);

Client.associate(connection.models);
Freelancer.associate(connection.models);

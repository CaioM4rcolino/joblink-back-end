const Sequelize = require("sequelize");
const dbConfig = require('../config/database');

const User = require("../models/User");
const Client = require("../models/Client");
const Freelancer = require("../models/Freelancer");
const Post = require("../models/Post");
const Profession = require('../models/Profession');

const connection = new Sequelize(dbConfig);

User.init(connection)
Client.init(connection);
Freelancer.init(connection);
Post.init(connection);
Profession.init(connection);

User.associate(connection.models)
Client.associate(connection.models);
Freelancer.associate(connection.models);
Post.associate(connection.models)
Profession.associate(connection.models);

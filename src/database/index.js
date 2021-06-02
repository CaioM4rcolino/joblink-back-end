const Sequelize = require("sequelize");
const dbConfig = require('../config/database');

const User = require("../models/User");
const Client = require("../models/Client");
const Freelancer = require("../models/Freelancer");
const Post = require("../models/Post");
const Profession = require('../models/Profession');
const Category = require("../models/Category");
const Service = require("../models/Service");
const BalanceRegister = require("../models/BalanceRegister")
const Chat = require("../models/Chat")
const Message = require("../models/Message")

const connection = new Sequelize(dbConfig);

User.init(connection)
Client.init(connection);
Freelancer.init(connection);
Post.init(connection);
Profession.init(connection);
Category.init(connection);
Service.init(connection);
BalanceRegister.init(connection)
Chat.init(connection);
Message.init(connection)

User.associate(connection.models)
Client.associate(connection.models);
Freelancer.associate(connection.models);
Post.associate(connection.models)
Profession.associate(connection.models);
Category.associate(connection.models)
Service.associate(connection.models);
BalanceRegister.associate(connection.models);
Chat.associate(connection.models)
Message.associate(connection.models)
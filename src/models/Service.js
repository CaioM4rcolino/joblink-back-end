const { Model, DataTypes } = require("sequelize");

class Service extends Model{
    //aqui inicializamos nossos campos na tabela
    static init(sequelize){
        super.init(
            
            {
            progress: DataTypes.STRING,
            is_from_client: DataTypes.TINYINT,
            service_cost: DataTypes.STRING,
            rating: DataTypes.STRING,
            feedback: DataTypes.TEXT

            },
            {
                sequelize,
            }
        
        )
    }

    static associate(models){
        this.sequelize
        this.belongsTo(models.User, {foreignKey: "id_user"});
        this.belongsTo(models.Post, {foreignKey: "id_post"});

    }
}

module.exports = Service;
const { Model, DataTypes } = require("sequelize");

class Post extends Model{
    //aqui inicializamos nossos campos na tabela
    static init(sequelize){
        super.init(
            
            {
            
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            image: DataTypes.STRING,
            urgency: DataTypes.STRING,

           
            },
            {
                sequelize,
            }
        
        )
    }
    static associate(models){
        this.sequelize
        this.belongsTo(models.User, {foreignKey: "user_id"})
    }
}

module.exports = Post;
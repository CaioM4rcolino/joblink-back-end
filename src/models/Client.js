const { Model, DataTypes } = require("sequelize");

class Client extends Model{
    //aqui inicializamos nossos campos na tabela
    static init(sequelize){
        super.init(
            
            {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            birth_date: DataTypes.STRING,
            password: DataTypes.STRING,
            cpf: DataTypes.STRING,
            image: DataTypes.STRING,
            banned: DataTypes.TINYINT,
            suspended: DataTypes.TINYINT,
            online: DataTypes.TINYINT,
            },
            {
                sequelize,
            }
        
        )
    }

    static associate(models){
        this.sequelize
    }
}

module.exports = Client;
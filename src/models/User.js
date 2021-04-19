const { Model, DataTypes } = require("sequelize");

class User extends Model{
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
            is_freelancer: DataTypes.TINYINT
            },
            {
                sequelize,
            }
        
        )
    }

    static associate(models){
        this.sequelize
        this.hasOne(models.Client, {foreignKey: "id"})
        this.hasOne(models.Freelancer, {foreignKey: "id"})
        this.hasMany(models.Post, {foreignKey: "user_id"});
        this.hasMany(models.Profession, {foreignKey: "user_id"});

    }
}

module.exports = User;
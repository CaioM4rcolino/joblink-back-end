const { Model, DataTypes } = require("sequelize");

class BalanceRegister extends Model{
    //aqui inicializamos nossos campos na tabela
    static init(sequelize){
        super.init(
            
            {
            value: DataTypes.STRING,
            status_flow: DataTypes.STRING,

            },
            {
                sequelize,
                tableName: "balance_register"
            }
        
        )
    }

    static associate(models){
        
        this.belongsTo(models.User, {foreignKey: "id_freelancer"})
    }
}

module.exports = BalanceRegister;
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicKeyCredentials extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // This credential belongs to one User
      PublicKeyCredentials.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  PublicKeyCredentials.init({
    external_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    public_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PublicKeyCredentials',
    tableName: 'public_key_credentials' // Set the table name
  });
  return PublicKeyCredentials;
};

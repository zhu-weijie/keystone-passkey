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
      // define association here
    }
  }
  PublicKeyCredentials.init({
    external_id: DataTypes.STRING,
    public_key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PublicKeyCredentials',
  });
  return PublicKeyCredentials;
};
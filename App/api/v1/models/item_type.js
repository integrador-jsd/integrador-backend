/* eslint-disable func-names */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('item_type', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    tableName: 'Item_type',
    timestamps: false,
  });
};

/* eslint-disable func-names */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('event_state', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    tableName: 'Event_state',
    timestamps: false,
  });
};

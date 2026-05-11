const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'CustomerID'
    },
  },
  Username: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'Users',
  timestamps: true,
});

User.belongsTo(Customer, { foreignKey: 'CustomerID' });

module.exports = User;

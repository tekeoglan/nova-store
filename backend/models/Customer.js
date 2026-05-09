const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  CustomerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FullName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  City: {
    type: DataTypes.STRING(20),
  },
  Email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
}, {
  tableName: 'Customers',
  timestamps: false,
});

module.exports = Customer;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');

const Order = sequelize.define('Order', {
  OrderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'CustomerID',
    },
  },
  OrderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'Orders',
  timestamps: false,
});

Order.belongsTo(Customer, { foreignKey: 'CustomerID' });
Customer.hasMany(Order, { foreignKey: 'CustomerID' });

module.exports = Order;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderDetail = sequelize.define('OrderDetail', {
  DetailID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  OrderID: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'OrderID',
    },
  },
  ProductID: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'ProductID',
    },
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'OrderDetails',
  timestamps: false,
});

OrderDetail.belongsTo(Order, { foreignKey: 'OrderID' });
Order.hasMany(OrderDetail, { foreignKey: 'OrderID' });
OrderDetail.belongsTo(Product, { foreignKey: 'ProductID' });
Product.hasMany(OrderDetail, { foreignKey: 'ProductID' });

module.exports = OrderDetail;

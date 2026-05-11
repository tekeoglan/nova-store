const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  ProductID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ProductName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'CategoryID',
    },
  },
  ImageURL: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  ReviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  OldPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  IsSale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Products',
  timestamps: false,
});

Product.belongsTo(Category, { foreignKey: 'CategoryID' });
Category.hasMany(Product, { foreignKey: 'CategoryID' });

module.exports = Product;

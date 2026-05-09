const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  CategoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CategoryName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'Categories',
  timestamps: false,
});

module.exports = Category;

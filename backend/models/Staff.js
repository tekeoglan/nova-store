const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
  StaffID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'moderator',
  },
}, {
  tableName: 'Staffs',
  timestamps: true,
});

module.exports = Staff;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'instructor', 'admin'), defaultValue: 'student' },
  avatar: { type: DataTypes.STRING, defaultValue: '' },
  bio: { type: DataTypes.TEXT, defaultValue: '' },
  phone: { type: DataTypes.STRING, defaultValue: '' },
  birthDate: { type: DataTypes.DATEONLY, allowNull: true },
  city: { type: DataTypes.STRING, defaultValue: '' },
  province: { type: DataTypes.STRING, defaultValue: '' },
}, { timestamps: true });

module.exports = User;

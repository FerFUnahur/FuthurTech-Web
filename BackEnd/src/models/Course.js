const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  image: { type: DataTypes.STRING, defaultValue: '' },
  instructorId: { type: DataTypes.INTEGER, allowNull: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.ENUM('borrador', 'publicado'), defaultValue: 'borrador' },
}, { timestamps: true });

module.exports = Course;

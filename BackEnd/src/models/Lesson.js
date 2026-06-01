const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  moduleId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, defaultValue: '' },
  videoUrl: { type: DataTypes.STRING, defaultValue: '' },
  duration: { type: DataTypes.INTEGER, defaultValue: 0 },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

module.exports = Lesson;

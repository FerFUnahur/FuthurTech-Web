const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false,validate: {len: {args: [3, 50], caracteresmsg: "El nombre debe tener entre 3 y 100 caracteres."}} },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'instructor', 'admin'), defaultValue: 'student' },
  avatar: { type: DataTypes.STRING, defaultValue: '' },
  bio: { type: DataTypes.TEXT, defaultValue: '' },
  birthDate: { type: DataTypes.DATEONLY, allowNull: true,validate: {
      isBeforeToday(value) {
        if (value) {
          const inputDate = new Date(value);
          const today = new Date();
          // Seteamos las horas en 0 para comparar solo fechas
          today.setHours(0, 0, 0, 0);
          if (inputDate >= today) {
            throw new Error("La fecha de nacimiento debe ser anterior al día de hoy.");
          }
          // Opcional: Validar que no sea una fecha ridícula (ej. hace 120 años)
          const minDate = new Date();
          minDate.setFullYear(today.getFullYear() - 100);
          if (inputDate < minDate) {
            throw new Error("Por favor, ingresa una fecha de nacimiento válida.");
          }
        }
      }
    } },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

module.exports = User;

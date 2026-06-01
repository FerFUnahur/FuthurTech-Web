const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Course = require('./Course');
const Module = require('./Module');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');
const LessonProgress = require('./LessonProgress');
const Certificate = require('./Certificate');

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Course.belongsTo(User, { as: 'instructor', foreignKey: 'instructorId' });
Course.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Course, { foreignKey: 'categoryId' });

Course.hasMany(Module, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Module.belongsTo(Course, { foreignKey: 'courseId' });

Module.hasMany(Lesson, { foreignKey: 'moduleId', onDelete: 'CASCADE' });
Lesson.belongsTo(Module, { foreignKey: 'moduleId' });

User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

User.hasMany(LessonProgress, { foreignKey: 'userId' });
LessonProgress.belongsTo(User, { foreignKey: 'userId' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lessonId' });

User.hasMany(Certificate, { foreignKey: 'userId' });
Certificate.belongsTo(User, { foreignKey: 'userId' });
Certificate.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = {
  User, Category, Product, Order, OrderItem,
  Course, Module, Lesson, Enrollment, LessonProgress, Certificate,
};

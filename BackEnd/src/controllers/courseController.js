const { Course, Module, Lesson, Category, User, Enrollment } = require('../models');

exports.getAll = async (req, res) => {
  const where = {};
  if (req.query.categoryId) where.categoryId = req.query.categoryId;
  if (req.query.search) where.title = { [require('sequelize').Op.like]: `%${req.query.search}%` };
  const courses = await Course.findAll({
    where: req.user?.role === 'admin' ? where : { ...where, status: 'publicado' },
    attributes: { include: ['instructorId'] },
    include: [{ model: User, as: 'instructor', attributes: ['id', 'name'] }, Category],
  });
  res.json(courses);
};

exports.getById = async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      { model: User, as: 'instructor', attributes: ['id', 'name'] },
      Category,
      { model: Module, include: [Lesson], order: [['order', 'ASC'], [Lesson, 'order', 'ASC']] },
    ],
  });
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json(course);
};

exports.create = async (req, res) => {
  const course = await Course.create({ ...req.body, instructorId: req.user.id });
  res.status(201).json(course);
};

exports.update = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  await course.update(req.body);
  res.json(course);
};

exports.remove = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  await course.destroy();
  res.json({ message: 'Curso eliminado' });
};

exports.getStudents = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  const enrollments = await Enrollment.findAll({
    where: { courseId: req.params.id },
    include: [{ model: User, attributes: ['id', 'name', 'email', 'avatar'] }],
  });
  res.json(enrollments);
};

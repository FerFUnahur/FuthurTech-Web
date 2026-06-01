const { Module, Lesson, Course } = require('../models');

exports.create = async (req, res) => {
  const course = await Course.findByPk(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  const mod = await Module.create({ ...req.body, courseId: req.params.courseId });
  res.status(201).json(mod);
};

exports.update = async (req, res) => {
  const mod = await Module.findByPk(req.params.id);
  if (!mod) return res.status(404).json({ error: 'Módulo no encontrado' });
  await mod.update(req.body);
  res.json(mod);
};

exports.remove = async (req, res) => {
  const mod = await Module.findByPk(req.params.id);
  if (!mod) return res.status(404).json({ error: 'Módulo no encontrado' });
  await mod.destroy();
  res.json({ message: 'Módulo eliminado' });
};

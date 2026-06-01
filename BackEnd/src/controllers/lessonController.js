const { Lesson, Module } = require('../models');

exports.create = async (req, res) => {
  const mod = await Module.findByPk(req.params.moduleId);
  if (!mod) return res.status(404).json({ error: 'Módulo no encontrado' });
  const lesson = await Lesson.create({ ...req.body, moduleId: req.params.moduleId });
  res.status(201).json(lesson);
};

exports.update = async (req, res) => {
  const lesson = await Lesson.findByPk(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });
  await lesson.update(req.body);
  res.json(lesson);
};

exports.remove = async (req, res) => {
  const lesson = await Lesson.findByPk(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });
  await lesson.destroy();
  res.json({ message: 'Lección eliminada' });
};

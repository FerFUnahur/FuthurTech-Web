const { Category, Course } = require('../models');

exports.getAll = async (req, res) => {
  const include = [];
  if (req.query.scope === 'courses') {
    include.push({ model: Course, attributes: [], required: true });
  }
  const categories = await Category.findAll({
    include: include.length > 0 ? include : undefined,
    distinct: true,
  });
  res.json(categories);
};

exports.create = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

exports.update = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
  await category.update(req.body);
  res.json(category);
};

exports.remove = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
  await category.destroy();
  res.json({ message: 'Categoría eliminada' });
};

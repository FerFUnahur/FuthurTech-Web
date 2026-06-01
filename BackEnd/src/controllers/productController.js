const { Op } = require('sequelize');
const { Product, Category } = require('../models');

exports.getAll = async (req, res) => {
  const { search, categoryId } = req.query;
  const where = {};
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (categoryId) where.categoryId = categoryId;
  const products = await Product.findAll({ where, include: [Category] });
  res.json(products);
};

exports.getById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: [Category] });
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
};

exports.create = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  await product.update(req.body);
  res.json(product);
};

exports.remove = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  await product.destroy();
  res.json({ message: 'Producto eliminado' });
};

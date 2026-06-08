const { Op } = require('sequelize');
const { Product, Category } = require('../models');

// funcion para normalizar las palabras 
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

exports.getAll = async (req, res) => {
  const { search, categoryId } = req.query;
  const where = {};
  if (categoryId) {where.categoryId = categoryId;}
  let products = await Product.findAll({
    where,
    include: [Category]
  });

  if (search) {
    const term = normalizeText(search);
    products = products.filter(product =>
      normalizeText(product.name).includes(term)
    );
  }
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

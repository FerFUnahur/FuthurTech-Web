const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'El nombre del producto no puede estar vacío.',
    'string.min': 'El nombre del producto debe tener al menos 2 caracteres.',
    'any.required': 'El nombre del producto es obligatorio.',
  }),
  description: Joi.string().allow('').optional(),
  price: Joi.number().positive().required().messages({
    'number.base': 'El precio debe ser un número.',
    'number.positive': 'El precio debe ser un valor mayor a cero.',
    'any.required': 'El precio es un campo obligatorio.',
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    'number.integer': 'El stock debe ser un número entero.',
    'number.min': 'El stock no puede ser un valor negativo.',
  }),
  image: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'La imagen del producto debe ser una URL válida.',
  }),
  categoryId: Joi.number().integer().allow(null).optional().messages({
    'number.base': 'El ID de la categoría debe ser un número válido.',
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  image: Joi.string().uri().allow('').optional(),
  categoryId: Joi.number().integer().allow(null).optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};

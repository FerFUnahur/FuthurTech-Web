const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'El nombre de la categoría no puede estar vacío.',
    'string.min': 'El nombre de la categoría debe tener al menos 2 caracteres.',
    'string.max': 'El nombre de la categoría no puede superar los 50 caracteres.',
    'any.required': 'El nombre de la categoría es un campo obligatorio.',
  }),
  description: Joi.string().allow('').max(500).optional().messages({
    'string.max': 'La descripción no puede superar los 500 caracteres.',
  }),
  image: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'La imagen de la categoría debe ser una URL válida.',
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  description: Joi.string().allow('').max(500).optional(),
  image: Joi.string().uri().allow('').optional(),
});

module.exports = { createCategorySchema, updateCategorySchema };

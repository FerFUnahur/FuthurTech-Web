const Joi = require('joi');

const createModuleSchema = Joi.object({
  courseId: Joi.number().integer().required().messages({
    'any.required': 'El ID del curso es obligatorio.',
  }),
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'El título del módulo no puede estar vacío.',
  }),
  description: Joi.string().allow('').optional(),
  order: Joi.number().integer().min(0).default(0),
});

const updateModuleSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().allow('').optional(),
  order: Joi.number().integer().min(0).optional(),
});

module.exports = { createModuleSchema, updateModuleSchema };

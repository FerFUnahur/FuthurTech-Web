const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().messages({
    'string.empty': 'El título del curso es obligatorio.',
    'string.min': 'El título del curso debe tener al menos 3 caracteres.',
  }),
  description: Joi.string().allow('').optional(),
  image: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'La imagen del curso debe ser una URL válida.',
  }),
  instructorId: Joi.number().integer().allow(null).optional(),
  categoryId: Joi.number().integer().allow(null).optional(),
  accessCode: Joi.string().min(4).max(20).required().messages({
    'string.empty': 'El código de acceso es obligatorio.',
    'any.required': 'El código de acceso es un campo obligatorio para el curso.',
  }),
  status: Joi.string().valid('borrador', 'publicado').default('borrador').messages({
    'any.only': 'El estado debe ser "borrador" o "publicado".',
  }),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(150).optional(),
  description: Joi.string().allow('').optional(),
  image: Joi.string().uri().allow('').optional(),
  instructorId: Joi.number().integer().allow(null).optional(),
  categoryId: Joi.number().integer().allow(null).optional(),
  accessCode: Joi.string().min(4).max(20).optional(),
  status: Joi.string().valid('borrador', 'publicado').optional(),
});

module.exports = { createCourseSchema, updateCourseSchema };

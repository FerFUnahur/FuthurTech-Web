const Joi = require('joi');

const createLessonSchema = Joi.object({
  moduleId: Joi.number().integer().required().messages({
    'number.base': 'El ID del módulo debe ser un número.',
    'any.required': 'El ID del módulo es obligatorio.',
  }),
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'El título de la lección no puede estar vacío.',
    'string.min': 'El título de la lección debe tener al menos 3 caracteres.',
    'string.max': 'El título no puede superar los 100 caracteres.',
  }),
  content: Joi.string().allow('').optional(),
  videoUrl: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'La URL del video debe ser un enlace válido (ej. YouTube/Vimeo).',
  }),
  duration: Joi.number().integer().min(0).default(0).messages({
    'number.min': 'La duración no puede ser negativa.',
  }),
  order: Joi.number().integer().min(0).default(0),
});

const updateLessonSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  content: Joi.string().allow('').optional(),
  videoUrl: Joi.string().uri().allow('').optional(),
  duration: Joi.number().integer().min(0).optional(),
  order: Joi.number().integer().min(0).optional(),
});

module.exports = { createLessonSchema, updateLessonSchema };

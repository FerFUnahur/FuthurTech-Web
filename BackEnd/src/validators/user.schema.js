const Joi = require('joi');

const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 10); // Hoy hace 10 años (Edad mínima)

const maxAgeDate = new Date();
maxAgeDate.setFullYear(maxAgeDate.getFullYear() - 100); // Hoy hace 100 años (Edad máxima)

const birthDateValidation = Joi.date()
  .iso()
  .max(minAgeDate) // Reemplaza 'now-10y' por el objeto Date real
  .min(maxAgeDate) // Reemplaza 'now-100y' por el objeto Date real
  .allow(null)
  .optional()
  .messages({
    'date.format': 'La fecha de nacimiento debe tener un formato válido (AAAA-MM-DD).',
    'date.max': 'Debes tener al menos 10 años.',
    'date.min': 'La edad máxima permitida es de 100 años.',
  });

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'El nombre no puede estar vacío.',
    'string.min': 'El nombre debe tener al menos 2 caracteres.',
    'string.max': 'El nombre no puede superar los 50 caracteres.',
    'any.required': 'El nombre es un campo obligatorio.',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Debe ingresar un correo electrónico válido.',
    'string.empty': 'El email no puede estar vacío.',
    'any.required': 'El email es un campo obligatorio.',
  }),

  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres.',
    'string.empty': 'La contraseña no puede estar vacía.',
    'any.required': 'La contraseña es un campo obligatorio.',
  }),

  role: Joi.string().valid('student', 'instructor', 'admin').default('student').messages({
    'any.only': "El rol debe ser 'student', 'instructor' o 'admin'.",
  }),

  avatar: Joi.string()
    .uri() // guardar una URL, para validar que tenga formato URI
    .allow('')
    .optional(),

  bio: Joi.string().allow('').max(500).optional(),

  birthDate: birthDateValidation,
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

///-----------------------

// ESCENARIO A: El usuario común edita su propio perfil
// No puede tocar ni email, ni role, ni active.
const updateOwnProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  avatar: Joi.string().allow('').optional(),
  bio: Joi.string().allow('').max(500).optional(),
  birthDate: birthDateValidation,
});

// ESCENARIO B: El Admin edita su propio perfil
// Puede editar sus datos comunes, pero además puede mandar 'active'
// (para que tu controlador lo ataje si intenta ponerse active: false).
const updateAdminOwnProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  avatar: Joi.string().allow('').optional(),
  bio: Joi.string().allow('').max(500).optional(),
  birthDate: birthDateValidation,
  active: Joi.boolean().optional(),
});

// ESCENARIO C: El Admin edita el perfil de OTRO usuario
// Tu controlador acá solo procesa 'role' y 'active'.
const updateByAdminSchema = Joi.object({
  role: Joi.string().valid('student', 'instructor', 'admin').optional(),
  active: Joi.boolean().optional(),
});

module.exports = {
  createUserSchema,
  loginSchema,
  updateOwnProfileSchema,
  updateAdminOwnProfileSchema,
  updateByAdminSchema,
};

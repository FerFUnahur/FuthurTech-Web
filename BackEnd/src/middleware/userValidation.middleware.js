const {
  updateOwnProfileSchema,
  updateAdminOwnProfileSchema,
  updateByAdminSchema,
} = require('../validators/user.schema');

const validateUpdate = (req, res, next) => {
  const targetId = parseInt(req.params.id);
  const isOwner = req.user.id === targetId;
  const isAdmin = req.user.role === 'admin';

  let schemaToUse;

  // 1. El Admin se edita a sí mismo
  if (isOwner && isAdmin) {
    schemaToUse = updateAdminOwnProfileSchema;
  }
  // 2. Un usuario común se edita a sí mismo
  else if (isOwner) {
    schemaToUse = updateOwnProfileSchema;
  }
  // 3. El Admin edita a otra persona
  else if (isAdmin) {
    schemaToUse = updateByAdminSchema;
  }
  // 4. No es dueño ni admin (Tu controlador responderá 403, lo dejamos pasar)
  else {
    return next();
  }

  // Ejecutamos la validación con el schema seleccionado
  const { error, value } = schemaToUse.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({ errors: error.details.map((d) => d.message) });
  }

  // Mutamos el req.body con los datos limpios y filtrados por Joi
  req.body = value;
  next();
};

module.exports = { validateUpdate };

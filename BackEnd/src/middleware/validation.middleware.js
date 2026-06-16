const validateBody = (schema) => {
  return (req, res, next) => {
    // validate() devuelve un objeto con { error, value }
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Para que devuelva TODOS los errores y no solo el primero
      stripUnknown: true, // Limpia el req.body de campos que no estén en el schema
    });

    if (error) {
      // Si hay error, mapeamos los mensajes para que queden claros
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: "Fail",
        errors: errorMessages,
      });
    }

    // Reemplazamos el req.body con el valor sanitizado por Joi
    req.body = value;
    next();
  };
};

module.exports = { validateBody };

const Joi = require("joi");

//compruebaMail
const compruebaMail = async (email) => {
  const schemaEmail = Joi.string().email().required();
  const validation = schemaEmail.validate(email);
  if (validation.error) {
    throw generateError("Debes introducir un email válido", 400);
  }

  return true;
};

//comprueba que existe el password y tiene entre 6 y 20 caracteres
const compruebaPass = async (password) => {
  const schemaPass = Joi.string().required().min(6).max(30);
  const validation = schemaPass.validate(password);
  if (validation.error) {
    throw generateError(
      "Debes introducir una contraseña de entre 6 y 30 carácteres",
      400
    );
  }
};
//comprueba que existe el texto
const compruebaTexto = async (texto) => {
  const schemaPass = Joi.string().required();

  const validation = schemaPass.validate(texto);
  if (validation.error) {
    throw generateError("Debes introducir un nombre", 400);
  }

  return true;
};

const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  return error;
};

module.exports = {
  compruebaMail,
  compruebaTexto,
  compruebaPass,
  generateError,
};

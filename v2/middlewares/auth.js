"use strict";
const jwt = require("jsonwebtoken");
const { generateError } = require("../helpers");

const authUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw generateError("Falta la cabecera de autorización", 401);
    }

    //Comprobamos que el token sea correcto
    let token;

    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch {
      throw generateError("Token no válido", 401);
    }

    //Metemos la informacion del token en la request para usarla en el controlador---OJO CON ESTO-----
    req.idUsuario = token.id;
    req.rol = token.rol;

    //Saltamos al controlador

    next(); //si todo va bien, continua con el siguiente middleware
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};

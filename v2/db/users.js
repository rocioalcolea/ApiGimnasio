"use strict";

//Cargamos la base de datos
const { getConnection } = require("./db");
const { generateError } = require("../helpers");
const bcrypt = require("bcrypt");

//Login de un usuario
const getUserByEmail = async (email) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `SELECT * FROM users WHERE email=?`,
      [email]
    );
    if (result.length === 0) {
      throw generateError("No existe usuario con ese email", 404);
    }
    return result[0];
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

//Devuelve la informacion publica de un usuario por su id
const getUserById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `SELECT id_user, nombre, email FROM users WHERE id_user=?`,
      [id]
    );
    if (result[0] === undefined) {
      throw generateError("El usuario no existe", 404);
    }

    return result[0];
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

//Crea un usuario en la base de datos y devuelve su id
const createUser = async (nombre, email, password) => {
  let connection;
  try {
    connection = await getConnection();
    //---------------Comprobar que no exista un usuario con ese email------------------
    const [user] = await connection.query(
      "SELECT id_user FROM users WHERE email = ?",
      [email]
    );
    if (user.length > 0) {
      throw generateError("El usuario ya existe", 409);
    }

    //---------------------Encriptar la contraseña--------------------
    const passwordHash = await bcrypt.hash(password, 10);

    //--------------Crear el usuario en la base de datos-----------------
    const [newUser] = await connection.query(
      "INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, passwordHash]
    );

    //--------------------Devolver el id del usuario creado----------------

    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};

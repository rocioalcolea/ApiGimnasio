const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  compruebaPass,
  compruebaMail,
  compruebaTexto,
  generateError,
} = require("../helpers");
const { createUser, getUserById, getUserByEmail } = require("./../db/users");

const newUserController = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    await compruebaPass(password);
    await compruebaMail(email);
    await compruebaTexto(nombre);
    const id = await createUser(nombre, email, password);

    res.send({
      status: "ok",
      message: `Usuario creado con id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};
//FALTA QUE SOLO MUESTRE DATOS SI SON SUS DATOS O ES EL ADMIN
const getUsersController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datosUsuario = await getUserById(id);

    res.send({
      status: "ok",
      data: datosUsuario,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await compruebaPass(password);
    await compruebaMail(email);

    //Recojo los datos de la bbdd del usuario con ese email............
    const users = await getUserByEmail(email);

    //Compruebo que las contraseñas coincidan
    const validPassword = await bcrypt.compare(password, users.password);
    if (!validPassword) {
      throw generateError("Contraseña incorrecta", 401);
    }

    //Creo el payload del token
    const payload = { id: users.id_user, rol: users.rol };

    //Firmo el token
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "20d" });

    //Envio el token

    res.send({
      status: "ok",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUsersController,
  loginController,
};

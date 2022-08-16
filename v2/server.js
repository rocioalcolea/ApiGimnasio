"use strict";

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

/* Importing the functions from the users.js file. */
const {
  newUserController,
  getUsersController,
  loginController,
} = require("./controllers/users");

/* Importing the functions from the ejercicios.js file. */
const {
  getEjerciciosController,
  newEjerciciosController,
  getEjercicioController,
  updateEjerciciosNombreController,
  updateEjerciciosDescripcionController,
  updateEjerciciosImagenController,
  updateEjerciciosTipologiaController,
  updateEjerciciosGruposMuscularesController,
  deleteEjerciciosController,
  filtroEjerciciosTipologia,
} = require("./controllers/ejercicios");

/* Importing the functions from the like.js file. */
const { postLike } = require("./controllers/like");

const { authUser } = require("./middlewares/auth");

//-------------------------------creo una intancia de express-----------------------------
const app = express();

//Le indico a express que procese los datos en formato json
app.use(express.json());

//Cargo fileupload para poder subir archivos
app.use(fileUpload());

//le digo a express que use morgan para que me muestre en consola las peticiones
app.use(morgan("dev"));

app.use("/uploads", express.static("./uploads"));

//Rutas de usuarios
app.post("/users", newUserController);
app.get("/users/:id", getUsersController);
app.post("/login", loginController);

//Rutas de ejercicios
app.post("/ejercicios", authUser, newEjerciciosController);
app.get("/ejercicios", authUser, getEjerciciosController);
app.get("/ejercicios/:id", authUser, getEjercicioController);
app.get("/ejercicios/tipologia/:id", authUser, filtroEjerciciosTipologia);
app.get("/ejercicios/grupoMuscular/:id", authUser, filtroEjerciciosTipologia);
app.put("/ejercicios/nombre/:id", authUser, updateEjerciciosNombreController);
app.put(
  "/ejercicios/imagen/:id",
  authUser,
  updateEjerciciosDescripcionController
);
app.put(
  "/ejercicios/descripcion/:id",
  authUser,
  updateEjerciciosImagenController
);
app.put(
  "/ejercicios/tipologias/:id",
  authUser,
  updateEjerciciosTipologiaController
);
app.put(
  "/ejercicios/gruposMusculares/:id",
  authUser,
  updateEjerciciosGruposMuscularesController
);
app.delete("/ejercicios/:id", authUser, deleteEjerciciosController);

//Ruta del like
app.post("/like/:eleccion", postLike);

//middleware de error 404
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "La ruta no existe",
  });
});

//Middleware de gestion de errores
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode || 500).send({
    status: "error",
    message: error.message,
  });
});

//lanzamos el servidor

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

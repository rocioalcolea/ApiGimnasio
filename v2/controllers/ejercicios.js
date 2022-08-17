const { compruebaTexto, generateError } = require("../helpers");
const path = require("path");
fs = require("fs").promises;
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const {
  createEjercicio,
  getAllEjercicios,
  getEjercicioById,
  deleteEjercicioById,
  updateEjercicioNombre,
  updateEjercicioDescripcion,
  updateEjercicioImagen,
  updateEjercicioTipologias,
  updateEjercicioGruposMusculares,
  buscarTipologia,
  buscarGrupoMuscular,
} = require("../db/ejercicios");

//listar ejercicios
const getEjerciciosController = async (req, res, next) => {
  try {
    //llama a la función de la base de datos para que recoja los ejercicios existentes
    const ejercicios = await getAllEjercicios();
    res.send({
      status: "ok",
      data: ejercicios,
    });
  } catch (error) {
    next(error);
  }
};

//crear nuevo ejercicio
const newEjerciciosController = async (req, res, next) => {
  try {
    const idUsuario = req.idUsuario;
    const rol = req.rol;

    //solo los administradores pueden crear ejercicios nuevos
    if (rol !== "admin") {
      throw generateError(
        "Solo el administrador puede crear ejercicios nuevos",
        400
      );
    }
    //recojo datos del body
    const { nombre, gruposMusculares, tipologias, descripcion } = req.body;

    //compruebo que los campos nombre, grupos musculares y tipologias no están vacios
    await compruebaTexto(nombre);
    await compruebaTexto(gruposMusculares);
    await compruebaTexto(tipologias);

    //recojo la imagen
    let imagenFileName;
    let nombreEncriptado;
    const nombreFichero = req.files.image.name;

    if (req.files && req.files.image) {
      //Creo el path del directorio uploads
      const uploadsDir = path.join(__dirname, "../uploads");

      //proceso la imagen
      const imagen = sharp(req.files.image.data);
      imagen.resize(900);

      //genero un nombre aleatorio para la imagen
      nombreEncriptado = `${uuidv4()}${path.extname(nombreFichero)}`;

      //subo la imagen al servidor
      await imagen.toFile(path.join(uploadsDir, nombreEncriptado));
    }
    //llamo a la función de la base de datos para guardar el nuevo ejercicio
    const id = await createEjercicio(
      idUsuario,
      nombre,
      descripcion,
      nombreEncriptado,
      tipologias,
      gruposMusculares
    );

    res.send({
      status: "ok",
      message: `Ejercicio con el id ${id} creado correctamente `,
    });
  } catch (error) {
    next(error);
  }
};

//coger ejercicio a través del id
const getEjercicioController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ejercicio = await getEjercicioById(id);
    res.send({
      status: "ok",
      data: ejercicio,
    });
  } catch (error) {
    next(error);
  }
};

//modifica el nombre del ejercicio
const updateEjerciciosNombreController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const rol = req.rol;
    if (rol !== "admin") {
      throw generateError(
        "Solo los administradores modifican los ejercicios",
        400
      );
    }
    //llamo a la base de datos para hacer la modificacion
    const cambioNombre = await updateEjercicioNombre(id, nombre);

    res.send({
      status: "ok",
      message: cambioNombre,
    });
  } catch (error) {
    next(error);
  }
};

//modifica la descripcion del ejercicio
const updateEjerciciosDescripcionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    const rol = req.rol;
    if (rol !== "admin") {
      throw generateError(
        "Solo los administradores modifican los ejercicios",
        400
      );
    }

    const cambioDescripcion = await updateEjercicioDescripcion(id, descripcion);

    res.send({
      status: "ok",
      message: cambioDescripcion,
    });
  } catch (error) {
    next(error);
  }
};

//Modifica la imagen
const updateEjerciciosImagenController = async (req, res, next) => {
  try {
    const rol = req.rol;
    if (rol !== "admin") {
      throw generateError(
        "Solo los administradores modifican los ejercicios",
        400
      );
    }
    const { id } = req.params;
    //recojo la imagen
    let imagenFileName;
    let nombreEncriptado;
    const nombreFichero = req.files.image.name;
    const ficheroBorrado = await getEjercicioById(id);

    //borro el fichero del servidor
    const path_file = path.join(
      __dirname,
      `..`,
      `uploads`,
      ficheroBorrado.imagen
    );

    //borro el fichero del servidor
    await fs.unlink(path_file);

    //subo el nuevo fichero al servidor
    if (req.files && req.files.image) {
      //Creo el path del directorio uploads
      const uploadsDir = path.join(__dirname, "../uploads");

      //proceso la imagen
      const imagen = sharp(req.files.image.data);
      imagen.resize(900);

      //genero un nombre aleatorio para la imagen
      nombreEncriptado = `${uuidv4()}${path.extname(nombreFichero)}`;

      //subo la imagen al servidor
      await imagen.toFile(path.join(uploadsDir, nombreEncriptado));
    }

    //modifico el nombre de fichero en la base de datos
    const modificarImagen = updateEjercicioImagen(id, nombreEncriptado);
    res.send({
      status: "ok",
      message: modificarImagen,
    });
  } catch (error) {
    next(error);
  }
};

//modifico las tipologias
const updateEjerciciosTipologiaController = async (req, res, next) => {
  try {
    const rol = req.rol;
    if (rol !== "admin") {
      throw generateError(
        "Solo los administradores modifican los ejercicios",
        400
      );
    }
    const { id } = req.params;
    const { tipologias } = req.body;
    const tipos = await updateEjercicioTipologias(id, tipologias);
    res.send({
      status: "ok",
      message: tipos,
    });
  } catch (error) {
    next(error);
  }
};

//modifico los grupos musculares
const updateEjerciciosGruposMuscularesController = async (req, res, next) => {
  try {
    const rol = req.rol;
    if (rol !== "admin") {
      throw generateError(
        "Solo los administradores modifican los ejercicios",
        400
      );
    }
    const { id } = req.params;
    const { gruposMusculares } = req.body;
    const grupos = await updateEjercicioGruposMusculares(id, gruposMusculares);
    res.send({
      status: "ok",
      message: grupos,
    });
  } catch (error) {
    next(error);
  }
};

//filtro tipologia
const filtroEjerciciosTipologia = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ejercicios = await buscarTipologia(id);

    res.send({
      status: "ok",
      data: ejercicios,
    });
  } catch (error) {
    next(error);
  }
};

//filtro grupo muscular
const filtroEjerciciosGrupoMuscular = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ejercicios = await buscarGrupoMuscular(id);

    res.send({
      status: "ok",
      data: ejercicios,
    });
  } catch (error) {
    next(error);
  }
};

//borrar ejercicio
const deleteEjerciciosController = async (req, res, next) => {
  try {
    const idUsuario = req.idUsuario;
    const rol = req.rol;
    const { id } = req.params;

    //solo los administradores pueden crear ejercicios nuevos
    if (rol !== "admin") {
      throw generateError("Solo el administrador puede borrar ejercicios", 400);
    }
    const borrado = await deleteEjercicioById(id);

    res.send({
      status: "ok",
      data: borrado,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEjerciciosController,
  newEjerciciosController,
  getEjercicioController,
  updateEjerciciosNombreController,
  updateEjerciciosDescripcionController,
  updateEjerciciosImagenController,
  updateEjerciciosTipologiaController,
  updateEjerciciosGruposMuscularesController,
  deleteEjerciciosController,
  filtroEjerciciosGrupoMuscular,
  filtroEjerciciosTipologia,
};

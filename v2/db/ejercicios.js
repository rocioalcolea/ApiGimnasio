"use strict";
const { generateError } = require("../helpers");
const { getConnection } = require("./db");

//modificar el nombre
const updateEjercicioNombre = async (id, nombre) => {
  let connection;
  try {
    connection = await getConnection();

    const ejercicio = await getEjercicioById(id);

    const [ejerciciobyName] = await connection.query(
      `UPDATE ejercicios SET nombre=? WHERE id_ejercicio=?`,
      [nombre, id]
    );

    return "modificado";
  } finally {
    if (connection) connection.release();
  }
};

//modificar la descripcion
const updateEjercicioDescripcion = async (id, descripcion) => {
  let connection;
  try {
    connection = await getConnection();

    const ejercicio = await getEjercicioById(id);

    const [ejerciciobyName] = await connection.query(
      `UPDATE ejercicios SET descripcion=? WHERE id_ejercicio=?`,
      [descripcion, id]
    );

    return "modificado";
  } finally {
    if (connection) connection.release();
  }
};

//modificar la imagen
const updateEjercicioImagen = async (id, nombreEncriptado) => {
  let connection;
  try {
    connection = await getConnection();

    const ejercicio = await getEjercicioById(id);

    const [ejerciciobyName] = await connection.query(
      `UPDATE ejercicios SET imagen=? WHERE id_ejercicio=?`,
      [nombreEncriptado, id]
    );
    return "modificado";
  } finally {
    if (connection) connection.release();
  }
};

//modificar las tipologias
const updateEjercicioTipologias = async (id, tipologias) => {
  let connection;
  try {
    connection = await getConnection();

    const ejercicio = await getEjercicioById(id);
    //separo el string para recoger las diferentes tipologías en un array
    const tipos = tipologias.split(",");

    //borro los datos obsoletos
    await connection.query(
      `DELETE FROM ejercicios_tipos WHERE id_ejercicio=?`,
      [id]
    );
    //inserto las tipologias en la tabla correspondiente
    for (const tipologia of tipos) {
      await connection.query(
        `INSERT INTO ejercicios_tipos (id_ejercicio, id_tipologia) VALUES (?, ?)`,
        [id, tipologia]
      );
    }
    return "modificado";
  } finally {
    if (connection) connection.release();
  }
};

//modificar grupos musculaers
const updateEjercicioGruposMusculares = async (id, gruposMusculares) => {
  let connection;
  try {
    connection = await getConnection();

    const ejercicio = await getEjercicioById(id);
    //separo el string para recoger las diferentes tipologías en un array
    const grupos = gruposMusculares.split(",");

    //borro los datos obsoletos
    await connection.query(
      `DELETE FROM ejercicios_gruposMusculares WHERE id_ejercicio=?`,
      [id]
    );
    //inserto las tipologias en la tabla correspondiente
    for (const grupo of grupos) {
      await connection.query(
        `INSERT INTO ejercicios_gruposMusculares (id_ejercicio, id_grupoMuscular) VALUES (?, ?)`,
        [id, grupo]
      );
    }
    return "modificado";
  } finally {
    if (connection) connection.release();
  }
};

//filtro tipologia
const buscarTipologia = async (id_tipologia) => {
  let connection;
  try {
    connection = await getConnection();

    const [filtroTipos] = await connection.query(
      `SELECT * FROM ejercicios WHERE id_ejercicio IN(SELECT id_ejercicio FROM ejercicios_tipos WHERE id_tipologia=?);
      `,
      [id_tipologia]
    );

    return filtroTipos;
  } finally {
    if (connection) connection.release();
  }
};

//filtro grupo Muscular
const buscarGrupoMuscular = async (id_grupoMuscular) => {
  let connection;
  try {
    connection = await getConnection();

    const [filtroGrupos] = await connection.query(
      `SELECT * FROM ejercicios WHERE id_ejercicio IN(SELECT id_ejercicio FROM ejercicios_gruposMusculares WHERE id_grupoMuscular=?); `,
      [id_grupoMuscular]
    );

    return filtroGrupos;
  } finally {
    if (connection) connection.release();
  }
};

//recojo ejercicio por nombre de ejercicio
const getEjerciciobyName = async (name) => {
  let connection;
  try {
    connection = await getConnection();
    const [ejerciciobyName] = await connection.query(
      `SELECT id_ejercicio FROM ejercicios WHERE nombre=?`,
      [name]
    );

    return ejerciciobyName;
  } finally {
    if (connection) connection.release();
  }
};

//borro ejercicio por id de ejercicio
const deleteEjercicioById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    //busca el ejercicio en la base de datos
    const ejercicio = await getEjercicioById(id);

    //borrar tipologias de ejercicio de la bbdd
    await connection.query(
      `DELETE FROM ejercicios_tipos WHERE id_ejercicio = ?`,
      [id]
    );

    //borrar grupos musculares de ejercicio de la bbdd
    await connection.query(
      `DELETE FROM ejercicios_gruposMusculares WHERE id_ejercicio = ?`,
      [id]
    );

    //borrar el ejercicio de la tabla ejercicios
    await connection.query(`DELETE FROM ejercicios WHERE id_ejercicio = ?`, [
      id,
    ]);

    return `${id} borrado`;
  } finally {
    if (connection) connection.release();
  }
};

//recojo ejercicio por id de ejercicio
const getEjercicioById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM ejercicios WHERE id_ejercicio = ?",
      [id]
    );

    if (result[0] === undefined) {
      throw generateError("Ejercicio no existe", 404);
    }
    return result[0];
  } finally {
    connection.release();
  }
};

//listado de ejercicios
const getAllEjercicios = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(`
      SELECT * FROM ejercicios ORDER BY nombre DESC`);
    return result;
  } finally {
    connection.release();
  }
};

//crear nuevo ejercicio
const createEjercicio = async (
  idUsuario,
  nombre,
  descripcion,
  nombreEncriptado = "",
  tipologias,
  gruposMusculares
) => {
  let connection;
  try {
    connection = await getConnection();
    //busco el ejercicio a traves del nombre, en la base de datos
    const existeEjercicio = await getEjerciciobyName(nombre);

    //si existe lanzo error
    if (existeEjercicio[0] !== undefined) {
      throw generateError("El ejercicio ya existe", 400);
    }

    //si no existe, lo añado en la tabla correspondiente
    const [result] = await connection.query(
      `INSERT INTO ejercicios (id_user, nombre, descripcion, imagen) VALUES (?, ?, ?, ?)`,
      [idUsuario, nombre, descripcion, nombreEncriptado]
    );
    if (result === undefined) {
      throw generateError("no se ha podido guardar el ejercicio", 500);
    }

    //separo el string para recoger las diferentes tipologías en un array
    const tipos = tipologias.split(",");
    //inserto las tipologias en la tabla correspondiente
    for (const tipologia of tipos) {
      await connection.query(
        `INSERT INTO ejercicios_tipos (id_ejercicio, id_tipologia) VALUES (?, ?)`,
        [result.insertId, tipologia]
      );
    }

    //separo el string para recoger los diferentes grupos musculares
    const grupos = gruposMusculares.split(",");
    //inserto los grupos musculares en la tabla correspondiente
    for (const grupo of grupos) {
      await connection.query(
        `INSERT INTO ejercicios_gruposMusculares (id_ejercicio, id_grupoMuscular) VALUES (?, ?)`,
        [result.insertId, grupo]
      );
    }
    //devuelvo el id del ejercicio creado
    return result.insertId;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createEjercicio,
  getAllEjercicios,
  getEjercicioById,
  updateEjercicioNombre,
  updateEjercicioDescripcion,
  updateEjercicioImagen,
  updateEjercicioTipologias,
  updateEjercicioGruposMusculares,
  deleteEjercicioById,
  buscarTipologia,
  buscarGrupoMuscular,
};

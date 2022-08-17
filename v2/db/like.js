const { generateError } = require("../helpers");
const { getConnection } = require("./db");
const { getEjercicioById } = require("./ejercicios");

const getLikeBD = async (idUsuario, id) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `SELECT id_likes FROM likes WHERE id_user=? AND id_ejercicio=?`,
      [idUsuario, id]
    );

    return result;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const postLikeBD = async (idUsuario, id) => {
  let connection;
  try {
    connection = await getConnection();
    const like = await getLikeBD(idUsuario, id);
    const ejercicio = await getEjercicioById(id);

    if (!(like[0] === undefined)) {
      throw generateError("Ya tiene tu like este ejercicio", 401);
    }
    const [result] = await connection.query(
      `INSERT INTO likes (id_user, id_ejercicio) VALUES(?,?) `,
      [idUsuario, parseInt(id)]
    );

    return result.insertId;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
const deleteLikeBD = async (idUsuario, id) => {
  let connection;
  try {
    connection = await getConnection();
    const like = await getLikeBD(idUsuario, id);
    const ejercicio = await getEjercicioById(id);

    if (like[0] === undefined) {
      throw generateError("Este ejercicio no tiene like para borrar", 401);
    }
    const [result] = await connection.query(
      `DELETE FROM likes WHERE  id_ejercicio=? AND id_user=? `,
      [parseInt(id), idUsuario]
    );

    return "like borrado";
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
module.exports = { getLikeBD, postLikeBD, deleteLikeBD };

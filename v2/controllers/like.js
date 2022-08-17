const { getLikeBD, postLikeBD, deleteLikeBD } = require("./../db/like");

const getLike = async (req, res, next) => {
  try {
    const idUsuario = req.idUsuario;
    const { id } = req.params;
    const like = await getLikeBD(idUsuario, id);

    res.send({
      status: "ok",
      data: like,
    });
  } catch (error) {
    next(error);
  }
};
const postLike = async (req, res, next) => {
  try {
    const idUsuario = req.idUsuario;
    const { id } = req.params;

    const like = await postLikeBD(idUsuario, id);

    res.send({
      status: "ok",
      data: like,
    });
  } catch (error) {
    next(error);
  }
};
const deleteLike = async (req, res, next) => {
  try {
    const idUsuario = req.idUsuario;
    const { id } = req.params;

    const like = await deleteLikeBD(idUsuario, id);

    res.send({
      status: "ok",
      data: like,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { postLike, getLike, deleteLike };

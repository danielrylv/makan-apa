const { Like } = require('../models');

class Controller {
  static addLike(req, res, next) {
    Like.create({
      UserId: req.params.userId,
      PostId: req.params.postId
    })
    .then(() => Like.count({
      where: { PostId: req.params.postId }
    }))
    .then((likesCount) => res.json({ likes_count: likesCount }))
    .catch(next);
  }
}

module.exports = Controller;

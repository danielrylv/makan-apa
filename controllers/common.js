const { Post } = require('../models');

class Controller {
  static showTimeline(req, res, next) {
    Post.findAll({ include: ['User', 'Likes'] })
      .then(posts => res.render('timeline', {
        posts,
        userId: req.session.userId
      }))
      .catch(next);
  }
}

module.exports = Controller;

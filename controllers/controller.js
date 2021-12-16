const { Post } = require('../models');

class Controller {
  static showTimeline(req, res, next) {
    Post.findAll()
      .then(posts => res.render('timeline', { posts }))
      .catch(next);
  }
}

module.exports = Controller;

const { Post, Like, PostTag, Tag } = require('../models');

class Controller {
  static showHome(req, res) {
    res.render('home');
  }

  static showTimeline(req, res, next) {
    if (req.query.tagId) {
      return Post.filterByTagId(req.query.tagId, Tag) 
        .then(posts => res.render('timeline', {
          posts,
          userId: req.session.userId
        }))
        .catch(err => console.log(err));
    }

    Post.findAll({ include: ['User', 'Likes', 'Tags'] })
      .then(posts => res.render('timeline', {
        posts,
        userId: req.session.userId
      }))
      .catch(next);
  }

  static deletePost(req, res, next) {
    PostTag.destroy({
      where: {
        PostId: req.params.postId
      }
    })
    .then(() => {
      return Like.destroy({
        where: {
          PostId: req.params.postId
        }
      });
    })
    .then(() => {
      return Post.destroy({
        where: {
          id: req.params.postId
        }
      });
    })
    .then(() => {
      res.redirect(`/user/${req.session.userId}`)
    })
    .catch(next);
  }
}

module.exports = Controller;

const { Post, User, Profile, Tag, PostTag } = require("../models");
const bcrypt = require("bcryptjs");

class Controller {
  static registration(req, res) {
    res.render("registration");
  }

  static addUser(req, res) {
    const user = ['fullname', 'email', 'password', 'role']
      .reduce(
        (obj, field) => (obj[field] = req.body[field], obj),
        {}
      );

    user.Profile = ['bio', 'phone', 'gender']
      .reduce(
        (obj, field) => (obj[field] = req.body[field], obj),
        {}
      );

    User.create(user, {
      include: Profile,
    })
      .then((data) => {
        req.session.userId = data.id;

        res.redirect("/timeline");
      })
      .catch((err) => [res.send(err)]);
  }

  static login(req, res) {
    const { error } = req.query;
    res.render("login", { error });
  }

  static postLogin(req, res, next) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          req.session.userId = user.id;

          return bcrypt.compare(password, user.password);
        } 

        return Promise.resolve(false);
      })
      .then(isCorrect => {
        if (isCorrect) {
          res.redirect("/timeline");
        } else {
          const error = "invalid email or password";

          return res.redirect(`/login?error=${error}`);
        }
      })
      .catch(next);
  }

  static profile(req, res, next) {
    User.findByPk(req.params.userId, {
      include: [Profile, {
        model: Post,
        include: ['User', 'Likes', 'Tags']
      }]
    })
    .then(user => {
      res.render('profile', {
        user,
        userId: req.session.userId
      });
    })
    .catch(next);
  }

  static newProfile(req, res) {
    res.render("createProfile");
  }

  static addProfile(req, res) {
    const { bio, gender, phone } = req.body;
    const value = { bio, gender, phone, UserId: req.session.userId };
    Profile.create(value)
      .then((data) => {
        res.redirect(`/user/${req.session.userId}`);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static editProfile(req, res) {
    Profile.findAll({
      include: User,
      where: {
        UserId: req.session.userId,
      },
    })
      .then((data) => {
        if (data.length) {
          res.render("editProfile", { data });
        } else {
          res.redirect("/user/create/profile");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static postEdit(req, res) {
    const { bio, gender, phone } = req.body;
    const value = { bio, gender, phone };
    Profile.update(value, {
      where: {
        UserId: req.session.userId,
      },
    })
    .then((data) => {
      res.redirect(`/user/${req.session.userId}`);
    })
    .catch((err) => {
      res.send(err);
    });
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if(err){
        res.send(err)
      }else{
        res.redirect('/login')
      }
    })
  }

  static showPostCreationPage(req, res, next) {
    Tag.findAll()
      .then(tags => res.render('post-add', {
        tags,
        userId: req.session.userId
      }))
      .catch(next);
  }

  static addPost(req, res, next) {
    Post.create({
      content: req.body.content,
      imgUrl: req.body.imageUrl,
      UserId: req.params.userId
    })
    .then(post => {
      const tagIds = Object.keys(req.body)
        .filter(v => v.substring(0, 3) == 'tag')
        .map(v => v.split('-')[1]);

      const postTags = tagIds.map(id => ({
        PostId: post.id,
        TagId: id
      }));

      return PostTag.bulkCreate(postTags);
    })
    .then(() => res.redirect(`/user/${req.params.userId}`))
    .catch(next);
  }

  static showChat(req, res, next) {
    User.findByPk(req.params.userId)
      .then(user => res.render('chat', {
        user,
        userId: req.session.userId
      }))
      .catch(next);
  }
}

module.exports = Controller;

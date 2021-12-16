const { Post, User, Profile, Tag, PostTag } = require("../models");
const bcrypt = require("bcryptjs");

class Controller {
  static registration(req, res) {
    res.render("registration");
  }

  static home(req, res) {
    res.render("home");
  }

  static addUser(req, res) {
    const { fullname, email, password, role } = req.body;
    const value = { fullname, email, password, role };
    User.create(value, {
      include: Profile,
    })
      .then((data) => {
        res.redirect("/user/login");
      })
      .catch((err) => [res.send(err)]);
  }

  static login(req, res) {
    const { error } = req.query;
    res.render("login", { error });
  }

  static postLogin(req, res) {
    const { fullname, password } = req.body;
    User.findOne({ where: { fullname } })
      .then((data) => {
        if (data) {
          req.session.userId = data.id;
          const isPassword = bcrypt.compareSync(password, data.password);
          if (isPassword) {
            return res.redirect("/timeline");
          } else {
            const error = "INVALID FULLNAME OR PASSWORD";
            return res.redirect(`/user/login?error=${error}`);
          }
        } else {
          const error = "INVALID FULLNAME OR PASSWORD";
          return res.redirect(`/user/login?error=${error}`);
        }
      })
      .catch((err) => {
        res.send(err);
      });
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
        res.redirect("/user/profile");
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
}

module.exports = Controller;

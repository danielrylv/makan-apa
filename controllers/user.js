const { Post, User, Profile } = require("../models");
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
            return res.redirect("/user/home");
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
      include: [Profile, Post]
    })
    .then(user => {
      if (!user.Profile) {
        return res.redirect('/user/create/profile')
      }

      res.render('profile', { user });
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
        res.redirect("/user/profile");
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
        res.redirect('/user/login')
      }
    })
  }
}

module.exports = Controller;

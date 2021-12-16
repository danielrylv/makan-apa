const { User, Profile } = require('../models');

class Controller{
    static registration(req, res){
        res.render('registration')
    }

    static addUser(req, res){
        const { fullname, email, password, role } = req.body
        const value = { fullname, email, password, role }
        User.create(value)
        .then(data => {
            res.redirect('/user/login')
        })
        .catch(err => [
            res.send(data)
        ])
    }

    static login(req, res){
        
    }
}

module.exports = Controller;
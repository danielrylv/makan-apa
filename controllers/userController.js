const { User, Profile } = require('../models');
const bcrypt = require('bcryptjs')

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
            res.send(err)
        ])
    }

    static login(req, res){
        res.render('login')
    }

    static postLogin(req, res){
        const { fullname, password } = req.body
        User.findOne({ where: { fullname } })
        .then(data => {
            if(data){
                const isPassword = bcrypt.compareSync(password, data.password);
                if(isPassword){
                    return res.redirect('/user/home');
                }else{
                    const error = 'INVALID FULLNAME OR PASSWORD'
                    return res.redirect(`/user/login?error=${error}`)
                }
            }
        })
        .catch(err => {
            res.send(err);
        })
    }
}

module.exports = Controller;
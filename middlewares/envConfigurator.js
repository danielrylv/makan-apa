module.exports = (req, res, next) => {
  if (process.env.SESSION_USER_ID) {
    req.session.userId = process.env.SESSION_USER_ID;
  }

  next();
}

const BYPASSED = {
  '/': true,
  '/login': true,
  '/registration': true,
  '/': true
}

module.exports = function(req, res, next){
  const destination = req.originalUrl.split('?').shift();

  if (BYPASSED[destination] || req.session.userId != null) {
    return next();
  }

  req.session.targetUrl = req.originalUrl;

  const error = `Login first!`

  
  res.redirect(`/login?error=${error}`);
}

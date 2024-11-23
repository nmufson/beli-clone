export function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

export function preventAuthenticatedAccess(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/feed');
  }
  next();
}

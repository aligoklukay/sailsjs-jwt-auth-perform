module.exports = async function (req, res, next) {
  if (!req.jeaders && !req.headers.authorization) {
    return res.badRequest({ err: "Authorization header is missing." });
  }
  const tokenParam = req.headers.authorization;
  const decodedToken = jwt.verify(tokenParam);
  const user = await User.findOne({
    id: decodedToken.user,
  });

  if (!user) {
    return next({ err: "Geçersiz bilgiler." });
  }

  req.user = user.id;
  next();
};

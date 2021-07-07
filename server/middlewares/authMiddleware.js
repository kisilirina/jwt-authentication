const ApiError = require("../exceptions/apiError");
const { validateAccessToken } = require("../service/tokenService");

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return next(ApiError.UnathorizatedError());

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) return next(ApiError.UnathorizatedError());

    const userData = validateAccessToken(accessToken);
    console.log(userData);
    if (!userData) return next(ApiError.UnathorizatedError());

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnathorizatedError());
  }
};

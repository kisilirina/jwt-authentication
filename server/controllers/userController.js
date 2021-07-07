const { validationResult } = require('express-validator');
const {
  registration,
  activate,
  login,
  logout,
  refreshService,
  getAllUsers,
} = require('../service/userService');
const ApiError = require('../exceptions/apiError');

const userSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при авторизации', errors.array()));
    }
    const { email, password } = req.body;
    const userData = await registration(email, password);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true }); // add true-flag if need https
    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

const userSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await login(email, password);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true }); // add true-flag if need https
    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

const userSignout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await refreshService(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true }); // add true-flag if need https
    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

const activateAccount = async (req, res, next) => {
  try {
    const { link } = req.params;
    await activate(link);
    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userSignup,
  userSignin,
  userSignout,
  refresh,
  activateAccount,
  getUsers,
}
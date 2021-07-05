const { registration } = require("../service/userService");

const userSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await registration(email, password);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true }); //add true-flag if need https
    return res.json(userData);
  } catch (error) {
    console.log(error);
  }
}

const userSignin = async (req, res, next) => {
  try {

  } catch (error) {

  }
}

const userSignout = async (req, res, next) => {
  try {

  } catch (error) {

  }
}

const refreshToken = async (req, res, next) => {
  try {

  } catch (error) {

  }
}

const activateAccount = async (req, res, next) => {
  try {

  } catch (error) {

  }
}

const getUsers = async (req, res, next) => {
  try {
    res.json(['123', '456']);
  } catch (error) {

  }
}

module.exports = {
  userSignup,
  userSignin,
  userSignout,
  refreshToken,
  activateAccount,
  getUsers
}
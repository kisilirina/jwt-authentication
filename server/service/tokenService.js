const jwt = require('jsonwebtoken');
const Token = require('../models/tokenModel');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return {
    accessToken,
    refreshToken,
  };
};

const saveToken = async (userID, refreshToken) => {
  const tokenData = await Token.findOne({ user: userID });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await Token.create({ user: userID, refreshToken });
  return token;
};

const removeToken = async (refreshToken) => {
  await Token.deleteOne({ refreshToken });
};

const findToken = async (refreshToken) => {
  const token = await Token.findOne({ refreshToken });
  return token;
};

const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateTokens,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
};

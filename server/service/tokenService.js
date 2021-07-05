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

module.exports = {
  generateTokens,
  saveToken,
};

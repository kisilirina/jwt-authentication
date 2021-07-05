const bcrypt = require('bcrypt');
const uuid = require('uuid');
const User = require('../models/userModel');
const { sendActivationLinkToEmail } = require('./mailService');
const { generateTokens, saveToken } = require('./tokenService');
const UserDto = require('../DTOs/userDTO');

const registration = async (email, password) => {
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw new Error(`Пользователь с адресом ${email} уже существует.`);
  }
  const hashPassword = await bcrypt.hash(password, 3);
  const activationLink = uuid.v4();

  const user = await User.create({ email, password: hashPassword, activationLink });
  await sendActivationLinkToEmail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};

module.exports = {
  registration,
};

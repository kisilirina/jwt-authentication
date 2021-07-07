const bcrypt = require('bcrypt');
const uuid = require('uuid');
const User = require('../models/userModel');
const { sendActivationLinkToEmail } = require('./mailService');
const { generateTokens, saveToken, removeToken, validateRefreshToken, findToken } = require('./tokenService');
const UserDto = require('../DTOs/userDTO');
const ApiError = require('../exceptions/apiError');

const registration = async (email, password) => {
  const candidate = await User.findOne({ email });
  if (candidate) throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует.`);

  const hashPassword = await bcrypt.hash(password, 3);
  const activationLink = uuid.v4();

  const user = await User.create({ email, password: hashPassword, activationLink });
  await sendActivationLinkToEmail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};

const activate = async (activationLink) => {
  const user = await User.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequest('Некорректная ссылка активации')
  }
  user.isActivated = true;
  await user.save();
}

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.BadRequest('Пользователь не был найден');

  const isPassEquals = await bcrypt.compare(password, user.password);
  if (!isPassEquals) {
    throw ApiError.BadRequest('Неверный пароль');
  }
  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

const logout = async (refreshToken) => {
  const token = await removeToken(refreshToken);
  return token;
};

const refreshService = async (refreshToken) => {
  if (!refreshToken) throw ApiError.UnathorizatedError();
  const userData = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);
  if (!userData || !tokenFromDB) throw ApiError.UnathorizatedError();

  const user = await User.findById(userData.id);
  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });

  await saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
}

module.exports = {
  registration,
  activate,
  login,
  logout,
  refreshService,
  getAllUsers,
};

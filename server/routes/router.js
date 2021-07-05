// const { Router } = require("express");
// const router = new Router();
const router = new require("express").Router();

const {
  userSignup,
  userSignin,
  userSignout,
  refreshToken,
  activateAccount,
  getUsers
} = require('../controllers/userController');


router.post('/signup', userSignup);
router.post('/signin', userSignin);
router.post('/signout', userSignout);
router.get('/activate/:link', activateAccount);
router.get('/refresh', refreshToken);
router.get('/users', getUsers);

module.exports = router;


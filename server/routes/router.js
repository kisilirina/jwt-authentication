const { Router } = require('express');

const router = new Router();

const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

const {
  userSignup,
  userSignin,
  userSignout,
  refresh,
  activateAccount,
  getUsers,
} = require('../controllers/userController');

router.post('/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userSignup);
router.post('/signin', userSignin);
router.post('/signout', userSignout);
router.get('/activate/:link', activateAccount);
router.get('/refresh', refresh);
router.get('/users', authMiddleware, getUsers);

module.exports = router;

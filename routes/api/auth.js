const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorsObject, tryOrServerError } = require('../../logic/logic');
const { check, validationResult } = require('express-validator');
const config = require('config');

const authUser = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', [authUser], (req, res) => {
  tryOrServerError(res, async () => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  });
});

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Email is not a valid one').isEmail(),
    check('password', 'please enter a password').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    tryOrServerError(res, async () => {
      // See if the user exists
      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).json(errorsObject('Invalid Credentials'));

      const isAMatch = await bcrypt.compare(password, user.password);

      if (!isAMatch)
        return res.status(400).json(errorsObject('Invalid Credentials'));

      // Return jsonwebtoken (So the user is logged in)
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    });
  }
);

module.exports = router;

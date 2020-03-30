const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { errorsObject } = require('../logic');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is not a valid one').isEmail(),
    check(
      'password',
      'please enter a password with 8 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json(errorsObject('User already in DB'));
      }

      // Get users gravatar (avatar from users email)
      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg',
        d: 'mm' // default user icon
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      // Return jsonwebtoken (So the user is logged in)
      res.send('User registered successfully');
    } catch (error) {
      console.error(err.message);
      res.status(500).send('Server error');
    }

    res.send('asd');
  }
);

module.exports = router;

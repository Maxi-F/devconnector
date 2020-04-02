const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { errorsObject, tryOrServerError } = require('../../logic/logic');
const config = require('config');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  tryOrServerError(res, async () => {
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

    try {
      await user.validate();
    } catch (errors) {
      return res.status(400).json(errorMessagesFromValidation(errors));
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken (So the user is logged in)
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtToken'),
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  });
});

module.exports = router;

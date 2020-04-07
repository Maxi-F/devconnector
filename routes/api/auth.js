const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { tryOrServerError } = require('../../logic/logic');

const { logInUser } = require('../../controllers/user');
const authUser = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    get user
// @access  Public
router.get('/', [authUser], (req, res) => {
  tryOrServerError(res, async () => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  });
});

// @route   POST api/users
// @desc    log in user
// @access  Public
router.post('/', (req, res) => {
  const { email, password } = req.body;

  tryOrServerError(res, async () => {
    const user = await logInUser({ email, password });

    if (user.errors) {
      res.json(user);
    }
    // Return jsonwebtoken (So the user is logged in)
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_TOKEN,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  });
});

module.exports = router;

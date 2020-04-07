const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { tryOrServerError } = require('../../logic/logic');
const config = require('config');
const { registerUser } = require('../../controllers/user');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  tryOrServerError(res, async () => {
    const savedUser = await registerUser({ name, email, password });

    if (savedUser.errors) {
      res.json(savedUser);
    }
    // Return jsonwebtoken (So the user is logged in)
    const payload = {
      user: {
        id: savedUser.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_TOKEN,
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  });
});

module.exports = router;

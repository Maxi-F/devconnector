const express = require('express');
const router = express.Router();

const Profile = require('../../models/Profile');
const { errorsObject, tryOrServerError } = require('../../logic/logic');
const authUser = require('../../middleware/auth');

// @route   GET api/currentprofile
// @desc    get current users profile
// @access  Private
router.get('/', [authUser], (req, res) => {
  tryOrServerError(res, async () => {
    const user = req.user;
    const userProfile = await Profile.findOne({ user: user.id });
    console.log({ userProfile });
    res.send('testgood');
  });
});

// @route   POST api/currentprofile
// @desc    create user profile
// @access  Private
router.post('/', [authUser], (req, res) => {
  tryOrServerError(res, async () => {
    const profile = new Profile({
      user: req.user.id,
      status: 'asd',
      skills: []
    });
    await profile.save();
    res.send('testgood');
  });
});

// @route   PUT api/currentprofile
// @desc    update user profile
// @access  Private
router.put('/', [authUser], async (req, res) => {
  try {
  } catch (error) {}
});

module.exports = router;

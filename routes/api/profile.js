const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { errorsObject, tryOrServerError } = require('../../logic/logic');
const authUser = require('../../middleware/auth');

// @route   GET api/profile/current
// @desc    get current users profile
// @access  Private
router.get('/current', [authUser], (req, res) => {
  tryOrServerError(res, async () => {
    const user = req.user;
    const userProfile = await Profile.findOne({
      user: user.id
    }).populate('user', ['name', 'avatar']);

    if (!userProfile) {
      return res
        .status(400)
        .json(errorsObject('There is no profile for this user'));
    }

    res.json(userProfile);
  });
});

// @route   POST api/profile
// @desc    create user profile
// @access  Private
router.post(
  '/',
  [
    authUser,
    check('status', 'status is required').notEmpty(),
    check('skills', 'skills are required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // unnecesary fields will be omitted
    const profile = new Profile(req.body);

    profile.user = req.user.id;

    profile.skills = req.body.skills.split(',').map(skill => skill.trim());

    tryOrServerError(res, async () => {
      await profile.validate();

      const savedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profile },
        { new: true, upsert: true }
      );

      return res.json(savedProfile);
    });
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', (req, res) => {
  tryOrServerError(res, async () => {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  });
});

// @route   GET api/profile/:user_id
// @desc    Get profile from user ID
// @access  Public
router.get('/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json(errorsObject('no user found'));

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId')
      return res.status(400).json(errorsObject('no user found'));
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete('/', authUser, (req, res) => {
  tryOrServerError(res, async () => {
    // @todo remove users posts
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  });
});

// @route   PUT api/profile/experience
// @desc    add profile experience to user
// @access  Private
router.put(
  '/experience',
  [
    authUser,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From is required').notEmpty(),
    check('location', 'Location is required').notEmpty()
  ],
  (req, res) => {
    tryOrServerError(res, async () => {
      const experience = new Profile(req.body);

      res.json({ msg: 'User deleted' });
    });
  }
);

module.exports = router;

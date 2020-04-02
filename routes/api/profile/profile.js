const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const Profile = require('../../../models/Profile');
const User = require('../../../models/User');
const {
  errorsObject,
  tryOrServerError,
  errorMessagesFromValidation
} = require('../../../logic/logic');
const {
  addRoutePutFor,
  addRouteDeleteFor
} = require('./listPropertiesHandlers');
const authUser = require('../../../middleware/auth');

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
router.post('/', [authUser], async (req, res) => {
  // unnecesary fields will be omitted
  const profile = new Profile(req.body);

  profile.user = req.user.id;

  profile.skills = req.body.skills.split(',').map(skill => skill.trim());

  tryOrServerError(res, async () => {
    try {
      await profile.validate();
    } catch (errors) {
      return res.status(400).json(errorMessagesFromValidation(errors));
    }

    const savedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profile },
      { new: true, upsert: true }
    );

    return res.json(savedProfile);
  });
});

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
addRoutePutFor(router, 'experience');

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
addRouteDeleteFor(router, 'experience');

// @route   PUT api/profile/education
// @desc    add profile education to user
// @access  Private
addRoutePutFor(router, 'education');

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
addRouteDeleteFor(router, 'education');

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', (req, res) => {
  tryOrServerError(res, async () => {
    const options = {
      url: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClient'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'get',
      headers: { 'user-agent': 'node.js' }
    };

    console.log(options);
    axios(options).then(response => {
      if (!(response.status >= 200 && response.status <= 300))
        return res.status(404).json(errorsObject('No github profile found'));
      res.json(response.data);
    });
  });
});

module.exports = router;

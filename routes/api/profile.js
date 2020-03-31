const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
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
        { new: true, useFindAndModify: false, upsert: true }
      );

      return res.json(savedProfile);
    });
  }
);

module.exports = router;

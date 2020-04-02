const express = require('express');
const Profile = require('../../../models/Profile');
const authUser = require('../../../middleware/auth');
const {
  tryOrServerError,
  errorMessagesFromValidation
} = require('../../../logic/logic');

const addValueToListInProfile = (router, key) => {
  console.log(`/${key}`);
  router.put(`/${key}`, [authUser], (req, res) => {
    // see if there is a better way 4 this
    const newValue = {};
    const valueValidKeys = Object.keys(
      Profile.schema.paths[key].schema.paths
    ).slice(0, -1);
    valueValidKeys.forEach(validKey => {
      if (req.body[validKey]) newValue[validKey] = req.body[validKey];
    });
    tryOrServerError(res, async () => {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile)
        return res.status(400).json(errorsObject('You must create a profile'));

      profile.experience.unshift(newValue);

      await profile.save(errors => {
        if (errors)
          return res.status(400).json(errorMessagesFromValidation(errors));
        res.json(profile);
      });
    });
  });
};

const deleteValueFromListInProfile = (router, key) => {
  router.delete(`/${key}/:${key}_id`, authUser, (req, res) => {
    tryOrServerError(res, async () => {
      const profile = await Profile.findOne({ user: req.user.id });

      profile[key] = profile[key].filter(
        valueInList => valueInList._id != req.params[`${key}_id`]
      );

      await profile.save();
      res.json({ profile });
    });
  });
};

module.exports = { addValueToListInProfile, deleteValueFromListInProfile };

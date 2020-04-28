const { errorsObject, errorMessagesFromValidation } = require('../logic/logic');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const findUser = async (userID) => {
  return await User.findById(userID).select('-password');
};

const registerUser = async (userObject) => {
  // See if the user exists
  let user = await User.findOne({ email: userObject.email });

  if (user) {
    return errorsObject('User already in DB');
  }

  // Get users gravatar (avatar from users email)
  const avatar = gravatar.url(userObject.email, {
    s: '200', // size
    r: 'pg',
    d: 'mm', // default user icon
  });

  user = new User({
    name: userObject.name,
    email: userObject.email,
    avatar,
    password: userObject.password,
  });

  try {
    await user.validate();
  } catch (errors) {
    return errorMessagesFromValidation(errors);
  }
  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(userObject.password, salt);

  await user.save();

  return user;
};

const logInUser = async (user) => {
  // See if the user exists
  const userInDB = await User.findOne({ email: user.email });
  if (!userInDB) return errorsObject('Invalid Credentials');

  const isAMatch = await bcrypt.compare(user.password, userInDB.password);

  if (!isAMatch) return errorsObject('Invalid Credentials');

  return userInDB;
};

module.exports = { registerUser, logInUser, findUser };

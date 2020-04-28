const { registerUser, logInUser, findUser } = require('../../controllers/user');
const mongoose = require('mongoose');
const User = require('../../models/User');
const { setupDB } = require('../setupDB');

describe('User Controllers', () => {
  setupDB();

  let mockedUser = {
    name: 'John Doe',
    email: 'johnDoe@gmail.com',
    password: '12345678',
    avatar: 'an avatar',
    date: 1,
  };

  const userCredentials = {
    email: 'johnDoe@gmail.com',
    password: '12345678',
  };

  it('registers an OK user', async () => {
    let savedUser = await registerUser(mockedUser);

    expect(savedUser.email).toBe(mockedUser.email);
  });

  it('does not register an user with validation errors', async () => {
    let mockedBadUser = { ...mockedUser };
    mockedBadUser.password = '1234';
    let savedUser = await registerUser(mockedBadUser);

    expect(savedUser.errors[0].msg).toBe('password is too small');
  });

  it('does not register an already registered user', async () => {
    await registerUser(mockedUser);
    let savedAgainUser = await registerUser(mockedUser);

    expect(savedAgainUser.errors[0].msg).toBe('User already in DB');
  });

  it('logs on an already registered user', async () => {
    await registerUser(mockedUser);

    const userInDB = await logInUser(userCredentials);

    expect(userInDB.email).toBe(mockedUser.email);
  });

  it('does not log in a non existant user', async () => {
    const userInDB = await logInUser(userCredentials);

    expect(userInDB.errors[0].msg).toBe('Invalid Credentials');
  });

  it('does not log in an user with wrong password', async () => {
    await registerUser(mockedUser);
    let badCredentials = { ...userCredentials };
    badCredentials.password = '1234';
    const userInDB = await logInUser(badCredentials);

    expect(userInDB.errors[0].msg).toBe('Invalid Credentials');
  });

  it('finds an existing user', async () => {
    let savedUser = await registerUser(mockedUser);
    let foundSavedUser = await findUser(savedUser._id);

    expect(savedUser.email).toBe(foundSavedUser.email);
  });
});

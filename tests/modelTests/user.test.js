const User = require('../../models/User');
const validateModelAndExpect = require('./utils');

describe('User Model validation', () => {
  let mockedUser = {
    name: 'John Doe',
    email: 'johnDoe@gmail.com',
    password: '12345678',
    avatar: 'an avatar',
    date: 1,
  };

  afterEach(() => {
    mockedUser = {
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: '12345678',
      avatar: 'an avatar',
      date: 1,
    };
  });

  it('validates an OK user', async () => {
    const user = new User(mockedUser);

    await validateModelAndExpect(user, (errorMessage) => {
      expect(errorMessage).toBeFalsy();
    });
  });

  it('does not validate an user without a required property', async () => {
    mockedUser.password = undefined;
    const user = new User(mockedUser);

    await validateModelAndExpect(user, (errorMessage) => {
      expect(errorMessage).toBe(
        'user validation failed: password: password is required'
      );
    });
  });

  it('does not validate an user without a valid email', async () => {
    mockedUser.email = 'johnDoe';
    const user = new User(mockedUser);

    await validateModelAndExpect(user, (errorMessage) => {
      expect(errorMessage).toBe(
        'user validation failed: email: johnDoe is not a valid email'
      );
    });
  });

  it('does not validate an user with a short password (for validation before hashing it)', async () => {
    mockedUser.password = '1234';
    const user = new User(mockedUser);

    await validateModelAndExpect(user, (errorMessage) => {
      expect(errorMessage).toBe(
        'user validation failed: password: password is too small'
      );
    });
  });
});

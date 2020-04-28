const User = require('../../models/User');

describe('User Model validation', () => {
  let mockedUser = {
    name: 'John Doe',
    email: 'johnDoe@gmail.com',
    password: '12345678',
    avatar: 'an avatar',
    date: 1,
  };

  const validateAndExpect = async (expectFunc) => {
    const user = new User(mockedUser);
    let message = false;

    try {
      await user.validate();
    } catch (error) {
      message = error.message;
    }
    expectFunc(message);
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
    await validateAndExpect((errorMessage) => {
      expect(errorMessage).toBeFalsy();
    });
  });

  it('does not validate an user without a required property', async () => {
    mockedUser.password = undefined;

    await validateAndExpect((errorMessage) => {
      expect(errorMessage).toBe(
        'user validation failed: password: password is required'
      );
    });
  });

  it('does not validate an user without a valid email', async () => {
    mockedUser.email = 'johnDoe';

    await validateAndExpect((errorMessage) => {
      expect(errorMessage).toBe(
        'user validation failed: email: johnDoe is not a valid email'
      );
    });
  });

  it('does not validate an user with a short password (for validation before hashing it)', async () => {
    mockedUser.password = '1234';

    await validateAndExpect((errorMessage) => {
      expect(errorMessage).toBe(
        'user validation failed: password: password is too small'
      );
    });
  });
});

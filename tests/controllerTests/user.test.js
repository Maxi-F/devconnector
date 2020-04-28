const { registerUser, logInUser } = require('../../controllers/user');
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Controllers', () => {
  let mockedUser = {
    name: 'John Doe',
    email: 'johnDoe@gmail.com',
    password: '12345678',
    avatar: 'an avatar',
    date: 1,
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.collections['users'].drop();
    await mongoose.connection.close();
  });

  it('registers an OK user', async () => {
    let savedUser = await registerUser(mockedUser);

    expect(savedUser.errors).toBeFalsy();
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
});

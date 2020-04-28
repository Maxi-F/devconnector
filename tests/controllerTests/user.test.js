const { registerUser, logInUser } = require('../../controllers/user');
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Controllers', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await User.drop();
    await mongoose.connection.close();
  });
});

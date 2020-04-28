const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('validates an OK user', async () => {
    const mockedUser = {
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: '123456',
      avatar: 'an avatar',
      date: 1,
    };
    const user = new User(mockedUser);
    let message = false;

    try {
      await user.validate();
    } catch (error) {
      message = error.message;
    }

    await expect(message).toBeFalsy();
  });
});

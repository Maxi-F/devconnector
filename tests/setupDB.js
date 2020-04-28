const mongoose = require('mongoose');

const removeDocsFromCollections = async () => {
  Object.values(mongoose.connection.collections).forEach(async (collection) => {
    await collection.deleteMany();
  });
};

const dropAllCollections = async () => {
  Object.values(mongoose.connection.collections).forEach(async (collection) => {
    await collection.drop();
  });
};

module.exports = {
  setupDB() {
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    });

    afterEach(async () => {
      await removeDocsFromCollections();
    });

    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
    });
  },
};

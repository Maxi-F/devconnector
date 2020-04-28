const mongoose = require('mongoose');
const db = process.env.MONGO_URL || 'mongodb://localhost:27017/example';

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error.message);

    // Exit process if there is an error with the DB
    process.exit(1);
  }
};

module.exports = connectDB;

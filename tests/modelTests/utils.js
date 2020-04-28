const validateModelAndExpect = async (model, expectFunc) => {
  let message = false;

  try {
    await model.validate();
  } catch (error) {
    message = error.message;
  }
  expectFunc(message);
};

module.exports = validateModelAndExpect;

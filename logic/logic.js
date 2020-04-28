const errorsObject = (msg, param, location) => {
  return {
    errors: [
      {
        msg,
        param,
        location,
      },
    ],
  };
};
const errorMessagesFromValidation = (validation) => {
  let errors = Object.values(validation.errors).map((error) => {
    return { msg: error.message };
  });
  return {
    errors,
  };
};

const tryOrServerError = async (res, func) => {
  try {
    await func();
  } catch (error) {
    res.status(500).send('server error');
    console.log(error.message);
  }
};

module.exports = {
  errorsObject,
  tryOrServerError,
  errorMessagesFromValidation,
};

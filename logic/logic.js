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
const errorMessagesFromValidation = (errors) =>
  Object.values(errors.errors).map((error) => {
    return errorsObject(error.message);
  });

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

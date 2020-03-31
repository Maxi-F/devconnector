const errorsObject = (msg, param, location) => {
  return {
    errors: [
      {
        msg,
        param,
        location
      }
    ]
  };
};

const tryOrServerError = (res, func) => {
  try {
    func();
  } catch (error) {
    res.status(500).send('server error');
    console.log(error.message);
  }
};

module.exports = { errorsObject, tryOrServerError };

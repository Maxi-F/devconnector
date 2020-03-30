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

module.exports = { errorsObject };

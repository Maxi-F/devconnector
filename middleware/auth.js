const jwt = require('jsonwebtoken');
const config = require('config');
const { errorsObject } = require('../logic/logic');

const authUser = (req, res, next) => {
  // Getting token from header
  const token = req.header('x-auth-token');

  if (!token)
    return res.status(401).json(errorsObject('No token, auth denied'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = decoded.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(errorsObject('Token is not valid, auth denied'));
  }
};

module.exports = authUser;

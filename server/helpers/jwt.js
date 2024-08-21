const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const signToken = (payload) => {
  return jwt.sign(payload, secret_key);
};

const verifyToken = (token) => {
  return jwt.verify(token, secret_key);
};

module.exports = {
  signToken,
  verifyToken,
};

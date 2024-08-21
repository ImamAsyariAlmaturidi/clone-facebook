const bcrypt = require("bcrypt");
const hashingPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports = {
  comparePassword,
  hashingPassword,
};

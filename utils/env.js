// tiny wrapper with default env vars
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

module.exports = {
  NODE_ENV,
  PORT,
};

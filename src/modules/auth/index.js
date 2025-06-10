const { login } = require('./actions/login');
const { register } = require('./actions/register');
const { validateToken } = require('./filters/validateToken');

const authModule = {
  name: 'auth',
  version: '1.0.0',
  description: 'Authentication module',
  actions: [
    {
      name: 'auth.login',
      handler: login
    },
    {
      name: 'auth.register',
      handler: register
    }
  ],
  filters: [
    {
      name: 'auth.validateToken',
      handler: validateToken
    }
  ]
};

module.exports = { authModule }; 
module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": ['eslint:recommended', 'prettier'],
  "plugins": ["prettier", 'import'],
}
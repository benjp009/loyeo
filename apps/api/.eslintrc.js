module.exports = {
  extends: ['@loyeo/config/eslint'],
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    node: true,
  },
};

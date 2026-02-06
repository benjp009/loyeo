module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript', '@loyeo/config/eslint'],
  parserOptions: {
    project: './tsconfig.json',
  },
};

module.exports = {
  extends: [
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    'react-hooks',
  ],
  rules: {
    // React Compiler 规则已在 eslint-plugin-react-hooks@rc 中默认启用
  },
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
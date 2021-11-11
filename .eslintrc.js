module.exports = {
 extends: ['erb', 'react-app', 'prettier'],
 plugins: ['prettier'],
 rules: {
  'prettier/prettier': 0,
  // A temporary hack related to IDE not resolving correct package.json
  'import/no-extraneous-dependencies': 'off',
  // Since React 17 and typescript 4.1 you can safely disable the rule
  'react/react-in-jsx-scope': 'off',
  'no-console': 'warn',
  semi: ['warn', 'never'],
  'comma-dangle': ['warn', 'never'],
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-use-before-define': 'off',
  'react/jsx-first-prop-new-line': [2, 'multiline'],
  'react/jsx-max-props-per-line': [2, { maximum: 1, when: 'multiline' }]
 },
 parserOptions: {
  ecmaVersion: 2020,
  sourceType: 'module',
  project: './tsconfig.json',
  tsconfigRootDir: __dirname,
  createDefaultProgram: true
 },
 settings: {
  'import/resolver': {
   // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
   node: {},
   webpack: {
    config: require.resolve('./.erb/configs/webpack.config.eslint.ts')
   }
  },
  'import/parsers': {
   '@typescript-eslint/parser': ['.ts', '.tsx']
  }
 }
}

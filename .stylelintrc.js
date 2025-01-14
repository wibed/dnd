module.exports = {
  processors: [
    [
      'stylelint-processor-styled-components',
      {
        moduleName: '@emotion/styled',
      },
    ],
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-styled-components',
    'stylelint-config-prettier',
  ],
  rules: {
    'declaration-empty-line-before': null,
    'comment-empty-line-before': null,
    'block-no-empty': null,
    'value-keyword-case': null,
  },
};

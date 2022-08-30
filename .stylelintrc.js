module.exports = {
    processors: ['stylelint-processor-html'],
    extends: [
        'stylelint-config-standard',
        'stylelint-config-sass-guidelines',
        'stylelint-prettier/recommended',
    ],
    rules: {
        'no-empty-source': null,
        'font-family-name-quotes': 'always-unless-keyword',
        'selector-max-id': 2,
        'import-notation': 'url',
        'color-function-notation': 'legacy',
        'value-no-vendor-prefix': null,
    },
};

const config = [
  {
    ignores: ['.next/**', 'next-env.d.ts']
  },
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  }
];

export default config;

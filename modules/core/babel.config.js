module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@': './src',
        '@domain': './src/domain',
        '@application': './src/application',
        '@infrastructure': './src/infrastructure',
        '@interfaces': './src/interfaces',
        '@config': './src/config',
        '@shared': './src/shared',
        '@tests': './tests'
      }
    }]
  ]
}; 
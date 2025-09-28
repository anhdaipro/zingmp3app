module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
      [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@form': './src/form',
          '@screens': './src/screens',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@type': './src/types',
          '@api': './src/api',
          '@store': './src/store',
          '@services': './src/services',
          '@navigation': './src/navigation',
          '@constant': './src/constant',
          '@context': './src/context',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
      'react-native-worklets/plugin',
    ],
};

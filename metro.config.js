const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const config = {
  resolver: {
    assetExts: [...assetExts, 'tflite'],
    sourceExts: sourceExts,
    blockList: [
      /node_modules[\/\\]react-native-fast-tflite[\/\\]android[\/\\]src[\/\\]main[\/\\]cpp[\/\\]lib[\/\\]litert[\/\\]headers[\/\\]tensorflow[\/\\]compiler[\/\\]mlir[\/\\]lite/
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);

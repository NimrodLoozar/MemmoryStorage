const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Enable tree shaking
  config.transformer.minifierConfig = {
    // Remove console statements in production
    drop_console: true,
    // Remove debugger statements
    drop_debugger: true,
    // Enable compression
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
    },
    // Mangle variable names for smaller bundle
    mangle: {
      reserved: ['$', 'exports', 'require'],
    },
  };

  // Optimize resolver for production
  config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
  
  // Enable source maps for production debugging
  config.transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  });
}

// Asset extensions
config.resolver.assetExts.push(
  // Image extensions
  'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp',
  // Font extensions
  'ttf', 'otf', 'woff', 'woff2',
  // Other assets
  'json', 'mp4', 'mp3'
);

// Source extensions
config.resolver.sourceExts.push('ts', 'tsx', 'js', 'jsx', 'json');

// Platform-specific optimizations
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
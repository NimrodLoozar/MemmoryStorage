module.exports = function (api) {
  api.cache(true);
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  const plugins = [
    // Required for Expo
    'expo-router/babel',
    
    // React Native Reanimated (must be last)
    'react-native-reanimated/plugin',
  ];

  // Production optimizations
  if (isProduction) {
    plugins.unshift(
      // Remove console.log statements in production
      ['transform-remove-console', { exclude: ['error', 'warn'] }],
      
      // Inline environment variables
      ['transform-inline-environment-variables'],
      
      // Remove dead code
      ['babel-plugin-transform-remove-undefined']
    );
  }

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Enable tree shaking
          modules: false,
          // Use modern JavaScript features
          targets: {
            // Modern mobile browsers and React Native
            ios: '13.0',
            android: '6.0',
            web: {
              browsers: ['> 1%', 'last 2 versions', 'not dead']
            }
          }
        }
      ]
    ],
    plugins,
    // Source maps for production debugging
    sourceMaps: true,
    // Minify in production
    minified: isProduction,
    // Remove comments in production
    comments: !isProduction
  };
};
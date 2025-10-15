import 'dotenv/config';

export default {
  expo: {
    name: "MemmoryStorage",
    slug: "MemmoryStorage",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "memmorystorage",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      adminPassword: process.env.ADMIN_PASSWORD || "admin123", // fallback for development
      appSecret: process.env.APP_SECRET || "default_secret_key",
      environment: process.env.ENVIRONMENT || "development",
      maxImageSize: process.env.MAX_IMAGE_SIZE || "5242880",
      defaultCompressionQuality: process.env.DEFAULT_COMPRESSION_QUALITY || "0.7"
    }
  }
};
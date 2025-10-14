# Memory Storage App �

This is a React Native app built with [Expo](https://expo.dev) that displays personal memory photos with interactive features, gamified challenges, and cross-platform styling.

## Get started

### Option 1: Local Development

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

### Option 2: Docker Development 🐳

For a containerized development environment:

1. **Quick start with Docker**:

   ```bash
   docker-compose up --build
   ```

2. **Access the app**:
   - Expo DevTools: http://localhost:19000
   - Web Version: http://localhost:19002

For detailed Docker instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

## Memory Storage Features

- 📱 **Cross-platform**: Runs on iOS, Android, and Web
- 🖼️ **Auto image management**: Automatically imports images from `assets/images/memmory/`
- 🎮 **Gamified interactions**: Heart-clicking challenges with easter eggs
- 📐 **Orientation filtering**: Automatically categorizes and filters horizontal/vertical images
- 🎨 **Dual styling system**: TypeScript StyleSheets for mobile, CSS for web
- 🔄 **Responsive design**: Adapts to different screen sizes

## Adding Memory Images

1. Add your photos to `assets/images/memmory/`
2. Run the image generation script:
   ```bash
   npm run generate-images
   ```
3. Restart the development server

## Available Scripts

- `npm start` - Start Expo development server
- `npm run web` - Start web-only development
- `npm run generate-images` - Regenerate image imports after adding photos
- `npm run reset-project` - Clean slate (moves starter to app-example)

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

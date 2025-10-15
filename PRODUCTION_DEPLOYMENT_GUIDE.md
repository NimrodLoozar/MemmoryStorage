# Production Deployment Guide

## Prerequisites

1. **Install EAS CLI**:

   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:

   ```bash
   eas login
   ```

3. **Configure Project**:
   ```bash
   eas build:configure
   ```

## Build Commands

### Development Builds

```bash
# Development build (for testing)
npm run build:development

# Preview build (internal testing)
npm run build:preview
```

### Production Builds

```bash
# Production build (all platforms)
npm run build:production

# Android production build
npm run build:android

# iOS production build
npm run build:ios

# Web production build
npm run build:web
```

## Platform-Specific Setup

### Android Production

1. **Generate Keystore** (if not exists):

   ```bash
   eas credentials
   ```

2. **Configure app.json**:

   - Set `android.package` to your unique package name
   - Update `android.versionCode` for each release

3. **Build APK/AAB**:
   ```bash
   eas build --platform android --profile production
   ```

### iOS Production

1. **Apple Developer Account Required**
2. **Configure Certificates**:

   ```bash
   eas credentials
   ```

3. **Update app.json**:

   - Set `ios.bundleIdentifier` to your unique bundle ID
   - Update `ios.buildNumber` for each release

4. **Build IPA**:
   ```bash
   eas build --platform ios --profile production
   ```

### Web Production

1. **Static Build**:

   ```bash
   npm run build:web
   ```

2. **Deploy to Hosting**:
   - Build output in `dist/` folder
   - Upload to your hosting provider
   - Ensure proper MIME types for web assets

## Environment Configuration

### Production Environment Variables

Copy `.env.production` to `.env` and update:

```env
NODE_ENV=production
ADMIN_PASSWORD=YourSecurePassword123!
ENABLE_DEBUG_UI=false
ENABLE_CONSOLE_LOGS=false
```

### Security Checklist

- [ ] Change default admin password
- [ ] Disable debug features
- [ ] Remove console logs
- [ ] Configure proper permissions
- [ ] Set up error reporting
- [ ] Configure analytics (optional)

## Submission to App Stores

### Google Play Store (Android)

```bash
# Submit to Google Play
eas submit --platform android
```

**Requirements**:

- Google Play Developer Account ($25 one-time fee)
- App Bundle (AAB) format
- App store listing (description, screenshots, etc.)
- Privacy policy (if collecting user data)

### Apple App Store (iOS)

```bash
# Submit to App Store
eas submit --platform ios
```

**Requirements**:

- Apple Developer Account ($99/year)
- IPA build
- App Store Connect listing
- App review compliance
- Privacy policy (if collecting user data)

## Testing Production Builds

### Android Testing

1. **Install APK**:

   ```bash
   adb install path/to/your-app.apk
   ```

2. **Internal Testing**:
   - Use Google Play Console Internal Testing
   - Share build with testers

### iOS Testing

1. **TestFlight**:

   - Automatic after EAS submission
   - Invite internal/external testers

2. **Ad Hoc Distribution**:
   ```bash
   eas build --platform ios --profile preview
   ```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze
```

### Image Optimization

- Images automatically compressed (600px max, 0.5 quality)
- Smart storage (AsyncStorage vs IndexedDB)
- Lazy loading implemented

### Cache Configuration

- Images cached in IndexedDB/AsyncStorage
- App updates via EAS Update
- Offline support for uploaded images

## Monitoring & Analytics

### Error Reporting (Optional)

Add to `.env.production`:

```env
SENTRY_DSN=your-sentry-dsn
BUGSNAG_API_KEY=your-bugsnag-key
```

### Analytics (Optional)

Add to `.env.production`:

```env
ANALYTICS_ID=your-analytics-id
```

## Update Workflow

### Over-the-Air Updates

```bash
# Publish updates (JavaScript/assets only)
eas update --branch production
```

### Native Updates

- Requires new build for native code changes
- Submit new version to app stores

## Troubleshooting

### Common Issues

1. **Build Failures**:

   - Check `eas.json` configuration
   - Verify credentials with `eas credentials`
   - Check Metro bundler issues

2. **Permissions**:

   - Ensure proper permissions in app.json
   - Test on physical devices

3. **Storage Issues**:
   - Test AsyncStorage limits on device
   - Verify IndexedDB support in web browsers

### Debug Production Issues

1. **Enable Flipper** (development builds only)
2. **Use Remote Debugging**
3. **Check Error Boundaries**
4. **Review Production Logs**

## Release Checklist

### Pre-Release

- [ ] Update version numbers (`app.json`, `package.json`)
- [ ] Run full test suite
- [ ] Test on physical devices (iOS/Android)
- [ ] Verify web build works in major browsers
- [ ] Test image upload/delete functionality
- [ ] Verify authentication system
- [ ] Test error boundaries
- [ ] Check performance metrics

### Release

- [ ] Build production versions
- [ ] Test production builds
- [ ] Submit to app stores (if applicable)
- [ ] Deploy web version
- [ ] Monitor for errors/crashes
- [ ] Update documentation

### Post-Release

- [ ] Monitor user feedback
- [ ] Track error reports
- [ ] Monitor performance metrics
- [ ] Plan next release cycle

## Support

### Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)

### Community

- [Expo Discord](https://discord.gg/expo)
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)

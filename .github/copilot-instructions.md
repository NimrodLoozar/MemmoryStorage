# AI Coding Agent Instructions - Memory Storage App

## Project Overview

Memory Storage is an Expo-based React Native app that displays personal memory photos with interactive features, gamified challenges, cross-platform styling, and secure admin authentication. This is a single-user photo gallery with unique UX patterns and hidden admin capabilities.

**Current Status**: 65% Production Ready - See PRODUCTION_READINESS_PLAN.md for complete production checklist
**Critical Issues**: Delete function not working, security vulnerabilities, debug code in production

## Production Readiness Context

### **CRITICAL FIXES NEEDED**:

1. **Delete Function Issues**: Delete buttons not responding properly, index mapping problems
2. **Security Vulnerabilities**: Hardcoded passwords, Docker vulnerabilities, missing environment variables
3. **Debug Code**: 50+ console.log statements need removal before production
4. **Error Handling**: No error boundaries, generic error messages
5. **Production Config**: Missing build configuration and crash reporting

### **Known Issues to Address**:

- Delete functionality broken (buttons don't respond to touch events)
- Index mapping issues between filtered and all images arrays
- Storage-aware deletion logic needs implementation
- State synchronization problems after deletion
- Touch event conflicts with image scrolling

Refer to PRODUCTION_READINESS_PLAN.md for the complete 16-task production preparation checklist.

## Architecture & Key Components

### Core Architecture

- **Expo Router v5** with file-based routing (`app/_layout.tsx`, `app/(tabs)/`, `app/login.tsx`)
- **React Native 0.79** with Expo SDK 53
- **TypeScript** throughout with strict typing
- **Cross-platform design**: Native mobile + web support via dual CSS/TypeScript styles
- **Docker containerization**: Full development environment with volume mounting

### Essential File Structure

```
app/
├── _layout.tsx              # Root navigation with ThemeProvider
├── login.tsx                # Dedicated admin login page
├── (tabs)/                  # Tab-based main navigation
│   ├── index.tsx            # Main gallery with authentication & upload
│   └── explore.tsx          # Secondary tab screen
└── secret-page.tsx          # Hidden easter egg page (admin only)

components/
├── AnimatedHeart.tsx        # Interactive heart with click tracking
├── ImageWithTightBorder.tsx # Custom image component with tight borders
├── NaturalImage.tsx         # Legacy image component
└── OrientationIcon.tsx      # SVG orientation indicator

styles/
├── index.ts                 # Barrel exports for all styles
├── *Styles.ts              # React Native StyleSheet format
└── *Styles.css             # Web CSS equivalents

utils/
├── memoryImages.ts         # Auto-generated image imports
└── memoryImages.alternative.ts

docker/
├── Dockerfile              # Node.js 20 Alpine with Expo CLI
└── docker-compose.yml      # Development environment setup
```

## Critical Developer Workflows

### Image Upload & Storage System

- **Cross-Platform Architecture**: Native FileSystem (iOS/Android) + Web Browser Storage (IndexedDB + AsyncStorage)
- **Smart Storage Selection**:
  - Small images (< 500KB): AsyncStorage for fast access
  - Large images (> 500KB): IndexedDB for unlimited capacity
  - Fallback chain: AsyncStorage → IndexedDB → Session-only
- **Advanced Compression**: Canvas-based processing with 600px max dimension, 0.5 JPEG quality
- **Storage Persistence**:
  - Native: expo-file-system permanent storage
  - Web: IndexedDB (large images) + AsyncStorage (small images)
- **Upload Process**: Image picker → Compression → Smart storage → State management → UI update
- **Delete Process**: ⚠️ **BROKEN** - Identifies storage type → Removes from correct storage → Updates all state arrays
  - **Critical Issue**: Delete buttons not responding to touch events
  - **Index Problems**: Mapping issues between filtered and all images arrays
  - **State Sync**: State synchronization problems after deletion
  - **Touch Events**: Button conflicts with image scrolling
  - **Fix Required**: See PRODUCTION_READINESS_PLAN.md Task 4

### Authentication System

- **Login Page**: Dedicated `/login` route with professional form interface
- **Default Password**: `admin123` (configurable in login.tsx)
- **Session Persistence**: AsyncStorage maintains login state across app restarts
- **Hidden Access**: Main heart click navigates to login when not authenticated
- **Admin Features**: Upload functionality, delete buttons, and storage management only visible when logged in
- **Logout**: Clean logout button appears in gallery when authenticated
- **Cross-platform**: Works identically on web and native mobile platforms

### Image Management System

- **Privacy Protected**: All memory images ignored by git via comprehensive .gitignore
- **Auto-generation**: Images are auto-imported via `scripts/generateImageImports.js`
- **Adding images**: Drop files in `assets/images/memmory/` then run `npm run generate-images`
- **Cross-platform upload system**: Admin can upload images directly through the app interface
- **Smart storage strategy**: Uses IndexedDB for large images, AsyncStorage for small images
- **Advanced compression**: Canvas-based image compression with 600px max dimension and 0.5 JPEG quality
- **Delete functionality**: ⚠️ **PARTIALLY BROKEN** - Admin can delete uploaded images (memory images show info dialog)
  - **Touch Issues**: Delete buttons not responding properly to touch events
  - **Index Mapping**: Problems with originalIndex calculation for filtered vs all images
  - **Storage Awareness**: Deletion logic needs to handle AsyncStorage vs IndexedDB correctly
  - **State Management**: Issues with state updates after successful deletion
- **Tight borders**: Custom `ImageWithTightBorder` component provides pixel-perfect borders
- **Orientation detection**: Automatic horizontal/vertical categorization with filtering
- **Supported formats**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
- **Web persistence**: Images survive browser refresh/restart using IndexedDB + AsyncStorage hybrid approach

### Development Commands

```bash
npm start              # Start Expo dev server
npm run generate-images # Regenerate image imports after adding photos
npm run reset-project  # Clean slate (moves starter to app-example)
npx expo start --web   # Web-specific development

# Docker commands
docker-compose build   # Build container with latest changes
docker-compose up -d   # Start development container
docker-compose logs    # View container logs
docker-compose restart # Restart after code changes
```

### Cross-Platform Styling System

- **Dual format**: Every style exists in both `.ts` (React Native) and `.css` (web)
- **Import pattern**: `import { PopupStyles, GalleryStyles, MainStyles } from '@/styles'`
- **Responsive logic**: Components handle `isLargeScreen` breakpoint logic (768px)
- **Barrel exports**: All styles centralized through `styles/index.ts`

## Project-Specific Conventions

### Authentication & Security Patterns

- **Two-tier heart system**: Popup heart (15-click challenge), main heart (single-click navigation)
- **Protected routes**: `/login` for admin access, `/secret-page` for logged-in users only
- **Session management**: AsyncStorage persistence with automatic state restoration
- **Clean UI**: No visible login indicators, admin features appear/disappear based on auth state
- **Privacy protection**: Comprehensive .gitignore prevents personal images from being committed

### Gamification Patterns

- **Popup challenge**: Initial modal requires 15 rapid clicks in 5 seconds to enter gallery
- **Click tracking**: `clickCount`, `firstClickTime`, `timeoutRef` pattern for timed challenges
- **Progress indicators**: Real-time feedback with progress bars and timers
- **State cleanup**: Proper timeout clearing and state reset after challenges
- **Modal gates**: Full-screen popup controls access to main app content

### Image Gallery System

- **Tight-fitting borders**: `ImageWithTightBorder` component provides pixel-perfect image borders
- **Orientation detection**: Images auto-categorized as 'horizontal'/'vertical' via `onLoad` event
- **Dynamic filtering**: Filter buttons show/hide images by orientation with SVG icons
- **Responsive sizing**: Different container/image styles per orientation and screen size
- **Upload integration**: Admin uploaded images seamlessly integrate with existing gallery
- **Delete buttons**: Red delete buttons (50x50px) appear on images when logged in
- **Smart deletion**: Uploaded images deleted completely, memory images show instructions
- **Index management**: Complex originalIndex calculation for filtered vs all images arrays
- **FlatList navigation**: Horizontal scrolling with pagination, dot indicators, and desktop buttons
- **Screen adaptation**: Navigation changes between mobile (swipe) and desktop (buttons)

### Component Architecture

- **ThemedText/ThemedView**: Consistent with Expo's theming system via `useColorScheme`
- **AnimatedHeart**: Complex animation state (scale + pulse) with dynamic colors and click counting
- **ImageWithTightBorder**: Custom sizing calculations for perfect border fitting
- **Expo Image**: Preferred over React Native Image for better performance and placeholder support

### File Naming & Organization

- **Barrel exports**: Use `@/styles`, `@/components`, `@/utils` imports consistently
- **TypeScript suffixes**: All React components use `.tsx`, utilities use `.ts`
- **Asset organization**: Memory photos in `assets/images/memmory/` (note spelling)

## Integration Patterns

### Navigation & Routing

- **Expo Router**: Use `router.push()` and `router.back()` for programmatic navigation
- **Tab structure**: Main content in `(tabs)` directory, special pages at root level
- **Authentication routing**: Heart clicks navigate to `/login` when not authenticated
- **Protected navigation**: Secret page access only when logged in
- **Deep linking**: App scheme defined as `memmorystorage://` in app.json

### State Management

- **Authentication state**: AsyncStorage for login persistence, useState for UI state
- **Image state**: Combined memory + uploaded images with orientation tracking
- **Local state**: useState patterns for UI state, useRef for animations and timers
- **No external state library**: Pure React patterns throughout
- **Effect cleanup**: Always clear timeouts in useEffect cleanup functions

### Animations & Interactions

- **React Native Animated API**: Preferred over external animation libraries
- **Haptic feedback**: `expo-haptics` integration via `HapticTab` component
- **SVG graphics**: `react-native-svg` for custom icons and orientation filters
- **FontAwesome**: Used selectively for standard UI icons
- **Click animations**: AnimatedHeart responds to click intensity with dynamic scaling

## Development Notes

### Image System

- **Memory images auto-loader**: Never manually edit `utils/memoryImages.ts` - always use the generation script
- **Privacy by design**: .gitignore prevents personal photos from being committed to git
- **Upload system**: Cross-platform image upload with smart storage management
- **Storage types**: AsyncStorage (small), IndexedDB (large), Session-only (fallback)
- **Compression system**: Canvas-based compression (600px max, 0.5 quality) for web storage
- **Delete system**: Storage-aware deletion (AsyncStorage vs IndexedDB vs session)
- **Tight borders**: ImageWithTightBorder calculates dimensions for pixel-perfect fitting
- **Index mapping**: Complex logic to map filtered array indices to original allImages indices
- **Persistence**: Images survive app/browser restarts through hybrid storage approach

### Authentication & Security

- **Hidden admin**: No visible login elements until authenticated
- **Session persistence**: Login state survives app restarts and refreshes
- **Default credentials**: admin123 password (configurable in login.tsx)
- **Clean logout**: Logout button only appears when authenticated
- **Admin features**: Upload and delete functionality only visible when logged in

### UI/UX Patterns

- **Challenge timing**: Popup heart requires 15 clicks in 5 seconds with visual progress
- **Main heart**: Single click navigation to login/secret page based on auth state
- **Delete buttons**: Large red circles (50x50px) with white borders for visibility
- **Admin indicators**: Green debug box shows login status during development
- **Theme consistency**: Dark/light theme handled automatically via Expo's theme system
- **Platform detection**: Use `Platform.select()` for platform-specific styles, `isLargeScreen` for responsive behavior
- **Error handling**: Images include fallback sources and error logging for debugging

## Debugging & Development Patterns

## Debugging & Development Patterns

### Image Upload & Storage Debugging

- **Storage Type Detection**: Console logs show which storage method is used (AsyncStorage/IndexedDB/Session)
- **Compression Monitoring**: Logs show original vs compressed image dimensions and file sizes
- **Storage Quota Management**: Smart fallback when storage limits are reached
- **Cross-Platform Testing**: Different storage strategies for web vs native platforms
- **Error Recovery**: Graceful degradation when storage operations fail

### Image Deletion Debugging

- **Index Validation**: Always verify originalIndex is valid before deletion attempts
- **Storage-Aware Deletion**: Different deletion logic for AsyncStorage vs IndexedDB images
- **Console Logging**: Comprehensive logging for button clicks, index mapping, and deletion flow
- **Error Handling**: Try-catch blocks around delete operations with user feedback
- **State Management**: Proper updates to both uploadedImages and allImages arrays
- **Persistence Sync**: Ensure correct storage (AsyncStorage/IndexedDB) is updated after deletions

### Common Issues & Solutions

- **Index Mapping**: Use `findIndex()` to properly map filtered array indices to original array
- **Storage Quota Exceeded**: Implement IndexedDB fallback for large images, AsyncStorage for small
- **Touch Events**: Ensure delete buttons have proper z-index and stopPropagation
- **State Updates**: Update all related state arrays when adding/removing images
- **Cross-Platform Storage**: Web uses IndexedDB+AsyncStorage, native uses FileSystem
- **Error Boundaries**: Wrap storage operations in try-catch for graceful error handling
- **Storage Type Tracking**: Track which storage method was used for each image for proper deletion
- **Debug Visibility**: Use large, contrasted buttons and comprehensive logging for debugging

## Performance Considerations

- **Image optimization**: Use `expo-image` with blur hash placeholders and lazy loading
- **Authentication caching**: AsyncStorage reduces auth checks and improves app startup
- **FlatList optimization**: Implement `getItemLayout` for known item dimensions
- **Animation performance**: Use `useNativeDriver: true` for transform animations
- **Responsive updates**: Debounce screen dimension changes to avoid excessive re-renders
- **Storage optimization**: Smart storage selection (AsyncStorage vs IndexedDB) based on image size
- **Compression efficiency**: Canvas-based compression reduces storage usage by 80-90%
- **Memory management**: Proper cleanup of object URLs and canvas contexts
- **Docker optimization**: Volume mounting for development, proper layer caching for builds

## Production Readiness Status

### **Current Production Readiness**: 65%

**Critical Blockers for Production**:

1. **Delete Function Broken**: Touch events not working, index mapping issues
2. **Security Vulnerabilities**: Hardcoded passwords, Docker image vulnerabilities
3. **Debug Code**: 50+ console.log statements need removal
4. **Missing Error Boundaries**: No global error handling
5. **Production Configuration**: Missing build settings and crash reporting

**Production Preparation Tasks** (See PRODUCTION_READINESS_PLAN.md):

- [ ] Fix delete function (Task 4)
- [ ] Remove debug console logs (Task 2)
- [ ] Implement environment variables (Task 1)
- [ ] Add error boundaries (Task 5)
- [ ] Configure production builds (Task 6)
- [ ] Security audit and hardening (Task 13)
- [ ] Performance optimization (Task 14)
- [ ] Comprehensive testing (Task 16)

**Target Production Readiness**: 95%

### **Known Critical Issues**:

#### **Delete Function Problems**:

- **Button Touch Events**: Delete buttons not responding to onPress events
- **Index Calculation**: Issues mapping filtered array indices to original allImages array
- **Storage Type Detection**: Need to properly identify AsyncStorage vs IndexedDB images
- **State Synchronization**: Problems updating both uploadedImages and allImages after deletion
- **Error Handling**: No graceful fallback when deletion fails

#### **Security Vulnerabilities**:

- **Hardcoded Password**: `admin123` in app/login.tsx line 21
- **Docker Vulnerabilities**: High severity issues in node:20-alpine base image
- **Missing Environment Variables**: No .env configuration for sensitive data
- **Input Validation**: Missing sanitization for user inputs

#### **Production Configuration Missing**:

- **Build Scripts**: No production build configuration in package.json
- **App Metadata**: Missing production settings in app.json
- **Error Reporting**: No crash reporting or analytics setup
- **Loading States**: Missing loading indicators for operations

## Advanced Storage System

### Multi-Tier Storage Architecture

Memory Storage implements a sophisticated multi-tier storage system for optimal performance and capacity:

#### **Native Platforms (iOS/Android)**

- **Primary Storage**: expo-file-system for permanent file storage
- **Capacity**: Limited by device storage space
- **Persistence**: Full persistence across app restarts
- **Performance**: Direct file system access for optimal speed

#### **Web Platform**

- **Tier 1 - AsyncStorage**: Small images (< 500KB) for fast access
- **Tier 2 - IndexedDB**: Large images (> 500KB) for unlimited capacity
- **Tier 3 - Session**: Fallback for storage failures (temporary)
- **Capacity**: AsyncStorage (~5-10MB), IndexedDB (~100MB-1GB+)
- **Persistence**: Both AsyncStorage and IndexedDB survive browser restarts

### Storage Selection Logic

```typescript
// Storage decision flow
if (Platform.OS === 'web') {
  if (imageSize < 500KB) {
    // Use AsyncStorage for fast access
    saveToAsyncStorage(compressedImage);
  } else {
    // Use IndexedDB for large capacity
    saveToIndexedDB(compressedImage);
  }
} else {
  // Native: Use FileSystem
  saveToFileSystem(originalImage);
}
```

### Image Processing Pipeline

1. **Image Selection**: expo-image-picker with permission handling
2. **Platform Detection**: Determine optimal storage strategy
3. **Compression**: Canvas-based compression (600px max, 0.5 quality)
4. **Storage Assignment**: Route to appropriate storage tier
5. **State Management**: Update React state and UI
6. **Persistence**: Save metadata and image data
7. **Error Handling**: Graceful fallbacks and user feedback

### Storage Management Functions

- **`openImageDB()`**: Initialize IndexedDB connection
- **`saveImageToIndexedDB()`**: Store large images in IndexedDB
- **`loadImagesFromIndexedDB()`**: Retrieve images from IndexedDB
- **`deleteImageFromIndexedDB()`**: Remove images from IndexedDB
- **Smart cleanup**: Automatic garbage collection and quota management

## Debugging & Development Patterns

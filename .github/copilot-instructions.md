# AI Coding Agent Instructions - Memory Storage App

## Project Overview

Memory Storage is an Expo-based React Native app that displays personal memory photos with interactive features, gamified challenges, cross-platform styling, and secure admin authentication. This is a single-user photo gallery with unique UX patterns and hidden admin capabilities.

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

### Authentication System

- **Login Page**: Dedicated `/login` route with professional form interface
- **Default Password**: `admin123` (configurable in login.tsx)
- **Session Persistence**: AsyncStorage maintains login state across app restarts
- **Hidden Access**: Main heart click navigates to login when not authenticated
- **Admin Features**: Upload functionality only visible when logged in
- **Logout**: Clean logout button appears in gallery when authenticated

### Image Management System

- **Privacy Protected**: All memory images ignored by git via comprehensive .gitignore
- **Auto-generation**: Images are auto-imported via `scripts/generateImageImports.js`
- **Adding images**: Drop files in `assets/images/memmory/` then run `npm run generate-images`
- **Upload system**: Admin can upload images directly through the app interface
- **Delete functionality**: Admin can delete uploaded images (memory images show info dialog)
- **Tight borders**: Custom `ImageWithTightBorder` component provides pixel-perfect borders
- **Orientation detection**: Automatic horizontal/vertical categorization with filtering
- **Supported formats**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

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
- **Upload system**: New images saved to AsyncStorage and integrated with existing gallery
- **Delete system**: Remove uploaded images from AsyncStorage and update UI state
- **Tight borders**: ImageWithTightBorder calculates dimensions for pixel-perfect fitting
- **Index mapping**: Complex logic to map filtered array indices to original allImages indices

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

### Image Deletion Debugging

- **Index Validation**: Always verify originalIndex is valid before deletion attempts
- **Console Logging**: Comprehensive logging for button clicks, index mapping, and deletion flow
- **Error Handling**: Try-catch blocks around delete operations with user feedback
- **State Management**: Proper updates to both uploadedImages and allImages arrays
- **AsyncStorage Sync**: Ensure persistent storage is updated after successful deletions

### Common Issues & Solutions

- **Index Mapping**: Use `findIndex()` to properly map filtered array indices to original array
- **Touch Events**: Ensure delete buttons have proper z-index and stopPropagation
- **State Updates**: Update all related state arrays when adding/removing images
- **Error Boundaries**: Wrap delete operations in try-catch for graceful error handling
- **Debug Visibility**: Use large, contrasted buttons and comprehensive logging for debugging

## Performance Considerations

- **Image optimization**: Use `expo-image` with blur hash placeholders and lazy loading
- **Authentication caching**: AsyncStorage reduces auth checks and improves app startup
- **FlatList optimization**: Implement `getItemLayout` for known item dimensions
- **Animation performance**: Use `useNativeDriver: true` for transform animations
- **Responsive updates**: Debounce screen dimension changes to avoid excessive re-renders
- **Docker optimization**: Volume mounting for development, proper layer caching for builds

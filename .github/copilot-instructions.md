# AI Coding Agent Instructions - Memory Storage App

## Project Overview

Memory Storage is an Expo-based React Native app that displays personal memory photos with interactive features, gamified challenges, and cross-platform styling. This is a single-user photo gallery with unique UX patterns.

## Architecture & Key Components

### Core Architecture

- **Expo Router v5** with file-based routing (`app/_layout.tsx`, `app/(tabs)/`)
- **React Native 0.79** with Expo SDK 53
- **TypeScript** throughout with strict typing
- **Cross-platform design**: Native mobile + web support via dual CSS/TypeScript styles

### Essential File Structure

```
app/
├── _layout.tsx              # Root navigation with ThemeProvider
├── (tabs)/                  # Tab-based main navigation
│   ├── index.tsx            # Main gallery screen with challenges
│   └── explore.tsx          # Secondary tab screen
└── secret-page.tsx          # Hidden easter egg page

components/
├── AnimatedHeart.tsx        # Interactive heart with click tracking
├── NaturalImage.tsx         # Custom image component
└── OrientationIcon.tsx      # SVG orientation indicator

styles/
├── index.ts                 # Barrel exports for all styles
├── *Styles.ts              # React Native StyleSheet format
└── *Styles.css             # Web CSS equivalents

utils/
├── memoryImages.ts         # Auto-generated image imports
└── memoryImages.alternative.ts
```

## Critical Developer Workflows

### Image Management System

- **Auto-generation**: Images are auto-imported via `scripts/generateImageImports.js`
- **Adding images**: Drop files in `assets/images/memmory/` then run `npm run generate-images`
- **Script regenerates**: `utils/memoryImages.ts` with all require() statements and helper functions
- **Supported formats**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

### Development Commands

```bash
npm start              # Start Expo dev server
npm run generate-images # Regenerate image imports after adding photos
npm run reset-project  # Clean slate (moves starter to app-example)
npx expo start --web   # Web-specific development
```

### Cross-Platform Styling System

- **Dual format**: Every style exists in both `.ts` (React Native) and `.css` (web)
- **Import pattern**: `import { PopupStyles, GalleryStyles, MainStyles } from '@/styles'`
- **Responsive logic**: Components handle `isLargeScreen` breakpoint logic (768px)
- **Barrel exports**: All styles centralized through `styles/index.ts`

## Project-Specific Conventions

### Gamification Patterns

- **Click challenges**: Heart components track rapid-click sequences (10-15 clicks in 5 seconds)
- **State tracking**: `clickCount`, `firstClickTime`, `timeoutRef` pattern for timed challenges
- **Modal challenges**: Full-screen popup gates access to main app content
- **Easter eggs**: Secret navigation triggered by interaction patterns

### Image Gallery System

- **Orientation detection**: Images auto-categorized as 'horizontal'/'vertical' via `onLoad` event
- **Dynamic filtering**: Filter buttons dynamically show/hide images by orientation
- **Responsive sizing**: Different container/image styles per orientation and screen size
- **FlatList navigation**: Horizontal scrolling with pagination, dot indicators, and desktop buttons
- **Screen adaptation**: Navigation changes between mobile (swipe) and desktop (buttons)

### Component Architecture

- **ThemedText/ThemedView**: Consistent with Expo's theming system via `useColorScheme`
- **AnimatedHeart**: Complex animation state (scale + pulse) with dynamic colors based on click intensity
- **Expo Image**: Preferred over React Native Image for better performance and placeholder support

### File Naming & Organization

- **Barrel exports**: Use `@/styles`, `@/components`, `@/utils` imports consistently
- **TypeScript suffixes**: All React components use `.tsx`, utilities use `.ts`
- **Asset organization**: Memory photos in `assets/images/memmory/` (note spelling)

## Integration Patterns

### Navigation & Routing

- **Expo Router**: Use `router.push()` and `router.back()` for programmatic navigation
- **Tab structure**: Main content in `(tabs)` directory, special pages at root level
- **Deep linking**: App scheme defined as `memmorystorage://` in app.json

### State Management

- **Local state**: useState patterns for UI state, useRef for animations and timers
- **No external state library**: Pure React patterns throughout
- **Effect cleanup**: Always clear timeouts in useEffect cleanup functions

### Animations & Interactions

- **React Native Animated API**: Preferred over external animation libraries
- **Haptic feedback**: `expo-haptics` integration via `HapticTab` component
- **SVG graphics**: `react-native-svg` for custom icons and graphics
- **FontAwesome**: Used selectively for standard UI icons

## Development Notes

- **Memory images auto-loader**: Never manually edit `utils/memoryImages.ts` - always use the generation script
- **Challenge timing**: All timed interactions use 5-second windows with visual progress indicators
- **Theme consistency**: Dark/light theme handled automatically via Expo's theme system
- **Platform detection**: Use `Platform.select()` for platform-specific styles, `isLargeScreen` for responsive behavior
- **Error handling**: Images include fallback sources and error logging for debugging

## Performance Considerations

- **Image optimization**: Use `expo-image` with blur hash placeholders and lazy loading
- **FlatList optimization**: Implement `getItemLayout` for known item dimensions
- **Animation performance**: Use `useNativeDriver: true` for transform animations
- **Responsive updates**: Debounce screen dimension changes to avoid excessive re-renders

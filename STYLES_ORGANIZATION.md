# Styles Organization

This document explains the style organization for the Memory Storage app.

## Structure

The styles have been organized into separate, modular files for better maintainability and cross-platform compatibility:

```
styles/
├── index.ts          # Barrel export file (imports all styles)
├── MainStyles.ts     # Main app layout and content styles (React Native)
├── MainStyles.css    # Main app layout and content styles (CSS/Web)
├── PopupStyles.ts    # Welcome challenge popup styles (React Native)
├── PopupStyles.css   # Welcome challenge popup styles (CSS/Web)
├── GalleryStyles.ts  # Image gallery and navigation styles (React Native)
└── GalleryStyles.css # Image gallery and navigation styles (CSS/Web)
```

## Dual Format Support

Each style module is available in two formats:

- **`.ts` files**: React Native StyleSheet format for mobile apps
- **`.css` files**: Standard CSS format for web applications

This dual approach allows the same design system to work across both React Native (mobile) and web platforms.

## Files Description

### `MainStyles.ts` / `MainStyles.css`

Contains styles for:

- Main layout containers (`mainContainer`, `heartContainer`, etc.)
- Achievement section (`achievementBox`, `achievementTitle`, etc.)
- General content styling (`title`, `subtitle`, `content`, etc.)
- Heart interaction elements (`clickCounter`, `heartHint`)

### `PopupStyles.ts` / `PopupStyles.css`

Contains styles for:

- Full-screen welcome challenge modal
- Challenge progress tracking (progress bar, timer, click counter)
- Popup content layout and typography
- Heart challenge interaction area

### `GalleryStyles.ts` / `GalleryStyles.css`

Contains styles for:

- Image gallery container and layout
- Responsive image sizing (desktop vs mobile)
- Navigation buttons (Previous/Next)
- Dot indicators for image position
- Gallery hints and instructional text

### `index.ts`

Barrel export file that centralizes all style imports for easy consumption.

## Usage

### React Native (Mobile)

Import TypeScript styles in your components like this:

```typescript
import { PopupStyles, GalleryStyles, MainStyles } from "@/styles";

// Use in component
<ThemedView style={MainStyles.achievementBox}>
  <ThemedText style={MainStyles.achievementTitle}>Achievement!</ThemedText>
</ThemedView>;
```

### Web (CSS)

For web applications, import the CSS files directly:

```html
<link rel="stylesheet" href="./styles/MainStyles.css" />
<link rel="stylesheet" href="./styles/PopupStyles.css" />
<link rel="stylesheet" href="./styles/GalleryStyles.css" />
```

Or in your web component:

```jsx
import "./styles/MainStyles.css";

// Use CSS classes
<div className="achievement-box">
  <h2 className="achievement-title">Achievement!</h2>
</div>;
```

## Benefits

1. **Cross-Platform Compatibility**: Same designs work on both mobile (React Native) and web (CSS)
2. **Modularity**: Each style file has a clear responsibility
3. **Maintainability**: Easy to find and update specific styles across platforms
4. **Reusability**: Styles can be imported and used across components
5. **Organization**: Clean separation between different UI concerns
6. **Readability**: Main component file is no longer cluttered with styles
7. **Consistency**: Design system ensures visual consistency across platforms

## Responsive Design

The styles include responsive breakpoints:

- **Desktop** (`isLargeScreen >= 768px`): Navigation buttons, larger images
- **Mobile** (`isLargeScreen < 768px`): Touch-optimized, smaller images

The responsive logic is handled in the component, while the styles provide the visual variations for each screen size.

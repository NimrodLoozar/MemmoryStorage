# Responsive Gallery Orientation Styling

## Overview

Enhanced the gallery with orientation-specific styling that adapts to both screen size (mobile/desktop) and image orientation (horizontal/vertical).

## New Styling System

### Container Styles

Different container heights based on image orientation:

#### Horizontal Images

- **Mobile**: 320px container height
- **Desktop**: 440px container height

#### Vertical Images

- **Mobile**: 420px container height
- **Desktop**: 540px container height

### Image Dimensions

#### Horizontal Images (Landscape)

- **Mobile**: 95% width × 280px height
- **Desktop**: 70% width × 400px height

#### Vertical Images (Portrait)

- **Mobile**: 85% width × 380px height
- **Desktop**: 50% width × 500px height

### Border Styling

- **Mobile**: 3px border width, 15px border radius
- **Desktop**: 4px border width, 20px border radius
- **Color**: `rgba(255, 20, 147, 0.4)` for mobile, `rgba(255, 20, 147, 0.5)` for desktop

## Dynamic Height Calculation

The FlatList container height adjusts based on the current filter:

```typescript
const getScrollViewHeight = () => {
  if (imageFilter === "horizontal") {
    return isLargeScreen ? 460 : 340; // Height for horizontal images
  } else if (imageFilter === "vertical") {
    return isLargeScreen ? 560 : 440; // Height for vertical images
  } else {
    // Mixed content - use a middle ground
    return isLargeScreen ? 510 : 390;
  }
};
```

## Implementation Details

### Style Classes Added

#### Container Styles

- `horizontalImageContainer`: Base container for horizontal images
- `verticalImageContainer`: Base container for vertical images
- `horizontalImageContainerDesktop`: Desktop-specific horizontal container
- `verticalImageContainerDesktop`: Desktop-specific vertical container

#### Image Styles

- `horizontalImageMobile`: Mobile horizontal image styling
- `verticalImageMobile`: Mobile vertical image styling
- `horizontalImageDesktop`: Desktop horizontal image styling
- `verticalImageDesktop`: Desktop vertical image styling

### Rendering Logic

The `renderImageItem` function now:

1. Detects the image orientation from the `imageOrientations` array
2. Selects appropriate container style based on orientation and screen size
3. Applies orientation-specific image styling
4. Uses dynamic height for optimal display

### Responsive Behavior

#### Mobile (< 768px)

- Horizontal images: Wider but shorter for landscape viewing
- Vertical images: Narrower but taller for portrait viewing
- Smaller borders and radius for mobile screens

#### Desktop (≥ 768px)

- Horizontal images: Moderate width with good height for detail
- Vertical images: Narrower width to prevent excessive stretching
- Larger borders and radius for better desktop aesthetics

## Benefits

1. **Optimized Display**: Each image type gets ideal dimensions for its orientation
2. **Responsive Design**: Adapts perfectly to mobile and desktop screens
3. **Visual Consistency**: Maintains proper aspect ratios and visual hierarchy
4. **Dynamic Adaptation**: Gallery height adjusts based on current filter selection
5. **Enhanced UX**: Better image viewing experience across all orientations

## Usage

The styling automatically applies based on:

- Screen size detection (`isLargeScreen`)
- Image orientation detection (`imageOrientations[index]`)
- Current filter selection (`imageFilter`)

No manual intervention required - the system automatically selects the appropriate styling for each image and viewing context.

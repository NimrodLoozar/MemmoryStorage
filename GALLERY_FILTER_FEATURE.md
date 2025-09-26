# Gallery Image Filter Feature

## Overview

The Memory Gallery now includes filter buttons to switch between different image types based on their orientation.

## Features

### Filter Options

- **All Images**: Shows all images in the gallery (default)
- **Horizontal Images**: Shows only landscape/horizontal images (width > height)
- **Vertical Images**: Shows only portrait/vertical images (height > width)

### Filter Buttons

- Located below the gallery title
- Shows count of images for each category
- Active filter is highlighted with a pink background
- Buttons are responsive and work on both mobile and desktop

### Automatic Orientation Detection

- Images are automatically analyzed when loaded
- Orientation is determined by comparing width vs height
- The system updates the button counts as images load

### Navigation Integration

- Navigation buttons (prev/next) work with filtered results
- Dot indicators show only filtered images
- Image counter reflects current filter
- Scroll navigation respects filter selection

## Implementation Details

### State Management

```typescript
const [imageFilter, setImageFilter] = useState<
  "all" | "horizontal" | "vertical"
>("all");
const [imageOrientations, setImageOrientations] = useState<
  ("horizontal" | "vertical")[]
>([]);
```

### Orientation Detection

Images are analyzed using the `onLoad` callback which provides image dimensions:

```typescript
const handleImageLoad = (index: number, event: any) => {
  const { source } = event;
  if (source && source.width && source.height) {
    const orientation =
      source.width > source.height ? "horizontal" : "vertical";
    // Update orientations array
  }
};
```

### Filtering Logic

```typescript
const filteredImages = memoryImages.filter((image, index) => {
  if (imageFilter === "all") return true;
  if (imageOrientations.length === 0) return true; // Show all if not detected yet
  return imageOrientations[index] === imageFilter;
});
```

## UI Components

### Filter Button Container

- Horizontal flex layout
- Centered alignment
- Proper spacing between buttons

### Individual Filter Buttons

- Rounded design with pink theme
- Active state styling
- Icon indicators (📏 for horizontal, 📐 for vertical)
- Dynamic count display

## Responsive Design

- Buttons scale appropriately on mobile vs desktop
- Touch-friendly button sizes
- Proper spacing for different screen sizes

## Usage Instructions

1. **View All Images**: Tap "All" to see every image in the gallery
2. **Filter Horizontal**: Tap "📏 Horizontal" to see only landscape images
3. **Filter Vertical**: Tap "📐 Vertical" to see only portrait images
4. **Navigation**: Use swipe gestures, dots, or navigation buttons to browse filtered results
5. **Counts**: Button labels show how many images are in each category

## Technical Notes

- Orientation detection happens asynchronously as images load
- Filter state resets scroll position to the beginning
- Navigation controls automatically adapt to filtered image count
- FlatList key extractor includes filter state for proper re-rendering

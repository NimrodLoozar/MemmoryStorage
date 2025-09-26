# Memory Gallery - Adding New Images

## How to Add New Memory Images

1. **Add your image files** to the `assets/images/memmory/` folder

   - Supported formats: `.png`, `.jpg`, `.jpeg`
   - Recommended size: 120x120px or larger (will be automatically resized)
   - Use descriptive names like `vacation1.png`, `birthday2.jpg`, etc.

2. **Update the image loader** in `utils/memoryImages.ts`

   - Add the new image to the `memoryImages` array using `require()`
   - Example: `require('@/assets/images/memmory/your-new-image.png')`

3. **The gallery will automatically show** all images in the array
   - No need to modify the main component
   - Images appear in the order they're listed in the array
   - The counter updates automatically

## Example

If you add `vacation.png` to the memmory folder:

```typescript
export const memoryImages = [
  require("@/assets/images/memmory/memory1.png"),
  require("@/assets/images/memmory/memory2.png"),
  require("@/assets/images/memmory/memory3.png"),
  require("@/assets/images/memmory/memory4.png"),
  require("@/assets/images/memmory/vacation.png"), // Add this line
];
```

## Current Images

The gallery currently contains:

- memory1.png
- memory2.png
- memory3.png
- memory4.png

Total: 4 images

## Features

- **Horizontal scrolling** through all memory images
- **Dynamic count** showing total number of memories
- **Responsive design** that works on all screen sizes
- **Smooth animations** and clean borders

# Border Fix: Tight Around Images

## Problem Fixed

The border was around a large container area instead of being tight around the actual image.

## Solution Applied

### 🎯 **Border Positioning**

- **Before**: Border on container → Large empty space inside border
- **After**: Border directly on image → Tight fit around image content

### 📏 **Sizing Adjustments**

**Desktop:**

- Width: 70% → **60%** (tighter)
- Border: Directly on image

**Mobile:**

- Width: 90% → **85%** (tighter)
- Border: Directly on image

### 💡 **How It Works**

1. **Container**: Clean, no border or background
2. **Image**: Gets the border, background, and rounded corners
3. **contentFit="contain"**: Image scales to fit within the bordered area
4. **Result**: Border appears tight around the visible image

### ✅ **Visual Outcome**

- Border now hugs the image closely on both desktop and mobile
- No more large empty space inside the border
- Cleaner, more professional appearance
- Images still maintain their natural aspect ratio

The border now acts like a picture frame that's perfectly sized for each image! 🖼️

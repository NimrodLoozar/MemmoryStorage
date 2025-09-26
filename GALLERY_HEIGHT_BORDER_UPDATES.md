# Gallery Height & Border Updates

## Changes Made

### 📏 **Increased Gallery Heights**

**Mobile:**

- Image height: 250px → **350px** (+100px)
- Container height: 300px → **450px** (+150px)

**Desktop:**

- Image height: 400px → **500px** (+100px)
- Container height: 300px → **550px** (+250px)

### 🖼️ **Border Styling Changes**

**Before:** Border only on image

```tsx
<Image style={{ borderWidth: 2 }} />
```

**After:** Border surrounds entire image area

```tsx
<View style={{ borderWidth: 2, padding: 5 }}>
  <Image style={{ borderWidth: 0 }} />
</View>
```

### ✨ **Visual Improvements**

1. **Larger Images**: All images are now significantly bigger
2. **Container Border**: Border wraps around the entire image container area
3. **Background**: Subtle dark background shows the container boundaries
4. **Padding**: Small padding (5px) between border and image
5. **Rounded Corners**: Both container and image have matching border radius

### 📱 **Responsive Design**

- **Mobile**: 350px height with 90% width
- **Desktop**: 500px height with 70% width
- **Container**: Auto-adjusts scroll area to fit larger images

Your gallery images are now much more prominent and the border creates a nice frame effect around each image! 🎨

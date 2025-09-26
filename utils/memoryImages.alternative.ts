// Alternative Memory Images Auto-Loader
// This approach uses a static mapping that's easier to maintain

// Import all images with descriptive names
const imageModules = {
  memory1: require('@/assets/images/memmory/memory1.png'),
  memory2: require('@/assets/images/memmory/memory2.png'),
  memory3: require('@/assets/images/memmory/memory3.png'),
  memory4: require('@/assets/images/memmory/memory4.png'),
  vacation: require('@/assets/images/memmory/vacation.jpeg'),
  // Add new images here following the pattern: imageName: require('@/assets/images/memmory/filename.ext'),
};

// Export array of all memory images
export const memoryImages = Object.values(imageModules);

// Export images by name for specific access
export const memoryImagesByName = imageModules;

// Helper function to get total count
export const getMemoryCount = () => memoryImages.length;

// Helper function to get a specific memory image
export const getMemoryImage = (index: number) => {
  if (index >= 0 && index < memoryImages.length) {
    return memoryImages[index];
  }
  return memoryImages[0]; // fallback to first image
};

// Helper function to get image by name
export const getMemoryImageByName = (name: string) => {
  return memoryImagesByName[name as keyof typeof memoryImagesByName] || memoryImages[0];
};

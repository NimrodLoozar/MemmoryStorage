// Script to clean console logs from index.tsx
// This will remove all console.log statements and replace console.error with Logger.error

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/(tabs)/index.tsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original file has', content.split('\n').length, 'lines');

// Count console statements before
const beforeCount = (content.match(/console\.(log|error|warn|info|debug)/g) || []).length;
console.log('Console statements before cleanup:', beforeCount);

// Remove all console.log statements (entire lines)
content = content.replace(/^\s*console\.log\([^;]*?\);?\s*$/gm, '');

// Replace console.error with Logger.error (keep these but make them production-safe)
content = content.replace(/console\.error\(/g, 'Logger.error(');

// Remove empty lines that might be left behind
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

// Count console statements after
const afterCount = (content.match(/console\.(log|error|warn|info|debug)/g) || []).length;
console.log('Console statements after cleanup:', afterCount);

// Write the cleaned file
fs.writeFileSync(filePath, content);

console.log('✅ Cleanup completed!');
console.log('📊 Removed', beforeCount - afterCount, 'console statements');
console.log('📄 Final file has', content.split('\n').length, 'lines');
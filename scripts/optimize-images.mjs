import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findSvgFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findSvgFiles(filePath, fileList);
    } else if (file.endsWith('.svg')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

const svgFiles = findSvgFiles('public');

for (const file of svgFiles) {
  try {
    const content = readFileSync(file, 'utf-8');
    
    const optimizedContent = content
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s*=\s*/g, '=')
      .replace(/<!--[\s\S]*?-->/g, '');
    
    writeFileSync(file, optimizedContent);
    console.log(`优化: ${file}`);
  } catch (error) {
    console.error(`错误优化 ${file}:`, error.message);
  }
}

console.log(`优化了 ${svgFiles.length} 个 SVG 文件`);

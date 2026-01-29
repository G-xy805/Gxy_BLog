import fs from 'fs';
import path from 'path';

// 要处理的目录
const postsDirectory = 'src/content/posts';

// 支持的非WebP图片格式
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif'];

// 递归遍历目录
function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 如果是目录，递归遍历
      traverseDir(filePath);
    } else if (stats.isFile() && path.extname(file) === '.md') {
      // 如果是Markdown文件，处理图片引用
      processMarkdownFile(filePath);
    }
  }
}

// 处理单个Markdown文件
function processMarkdownFile(filePath) {
  console.log(`处理文件: ${filePath}`);
  
  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 替换图片引用路径
  let updatedContent = content;
  
  // 替换Markdown图片语法: ![alt](path)
  updatedContent = updatedContent.replace(/!\[(.*?)\]\(([^)]+\.(jpg|jpeg|png|gif))\)/g, (match, alt, imgPath, ext) => {
    // 检查是否已经是WebP格式
    if (imgPath.endsWith('.webp')) {
      return match;
    }
    
    // 替换为WebP格式
    const webpPath = imgPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
    return `![${alt}](${webpPath})`;
  });
  
  // 替换HTML img标签: <img src="path" ...>
  updatedContent = updatedContent.replace(/<img[^>]+src="([^"]+\.(jpg|jpeg|png|gif))"/g, (match, imgPath, ext) => {
    // 检查是否已经是WebP格式
    if (imgPath.endsWith('.webp')) {
      return match;
    }
    
    // 替换为WebP格式
    const webpPath = imgPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
    return match.replace(imgPath, webpPath);
  });
  
  // 替换Frontmatter中的image字段
  updatedContent = updatedContent.replace(/image:\s*(["'])([^"']+\.(jpg|jpeg|png|gif))\1/g, (match, quote, imgPath, ext) => {
    // 检查是否已经是WebP格式
    if (imgPath.endsWith('.webp')) {
      return match;
    }
    
    // 替换为WebP格式
    const webpPath = imgPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
    return `image: ${quote}${webpPath}${quote}`;
  });
  
  // 如果内容有变化，写回文件
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✓ 更新成功: ${filePath}`);
  } else {
    console.log(`✓ 无需更新: ${filePath}`);
  }
}

// 主函数
function main() {
  console.log('开始批量更新Markdown文件中的图片引用路径...');
  
  if (fs.existsSync(postsDirectory)) {
    traverseDir(postsDirectory);
  } else {
    console.error(`目录不存在: ${postsDirectory}`);
  }
  
  console.log('\nMarkdown文件更新完成！');
}

// 运行主函数
main();
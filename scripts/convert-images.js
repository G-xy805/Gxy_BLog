import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 转换配置
const convertConfig = {
  quality: 90, // 保持视觉质量不低于原图片的90%
  webpOptions: {
    quality: 90,
    lossless: false
  }
};

// 要处理的目录
const directories = [
  'public/assets/images/friends',
  'public/assets/images/posts',
  'public/assets/images/projects'
];

// 支持的非WebP图片格式
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif'];

// 转换单个图片
async function convertImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp(convertConfig.webpOptions)
      .toFile(outputPath);
    console.log(`✓ 转换成功: ${inputPath} → ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`✗ 转换失败: ${inputPath}`, error);
    return false;
  }
}

// 处理目录
async function processDirectory(directory) {
  console.log(`\n处理目录: ${directory}`);
  
  if (!fs.existsSync(directory)) {
    console.error(`目录不存在: ${directory}`);
    return;
  }
  
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const inputPath = path.join(directory, file);
    const ext = path.extname(file).toLowerCase();
    
    // 只处理非WebP格式的图片
    if (supportedFormats.includes(ext) && !file.endsWith('.webp')) {
      const outputPath = path.join(directory, `${path.basename(file, ext)}.webp`);
      await convertImage(inputPath, outputPath);
    }
  }
}

// 主函数
async function main() {
  console.log('开始批量转换图片为WebP格式...');
  
  for (const directory of directories) {
    await processDirectory(directory);
  }
  
  console.log('\n图片转换完成！');
}

// 运行主函数
main().catch(console.error);
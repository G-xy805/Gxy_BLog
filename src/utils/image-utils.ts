/**
 * 处理文章封面图
 * @param image - 文章frontmatter中的image字段值
 * @returns 处理后的图片URL
 */
export function processCoverImageSync(
	image: string | undefined,
): string {
	// 如果image不存在或为空，直接返回
	if (!image || image === "") {
		return "";
	}

	// 直接返回原始图片路径
	return image;
}

/**
 * 异步版本（保持API兼容性）
 */
export async function processCoverImage(
	image: string | undefined,
): Promise<string> {
	return processCoverImageSync(image);
}

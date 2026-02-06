import { type CollectionEntry, getCollection, render } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// 先渲染所有文章以获取阅读时间数据
	const postsWithReadingTime = await Promise.all(
		allBlogPosts.map(async (post) => {
			// 渲染文章内容以获取frontmatter中的阅读时间数据
			const { remarkPluginFrontmatter } = await render(post);
			return {
				...post,
				readingTime: remarkPluginFrontmatter.minutes || 0,
			};
		}),
	);

	const sorted = postsWithReadingTime.sort((a, b) => {
		// 首先按置顶状态排序，置顶文章在前
		if (a.data.pinned && !b.data.pinned) return -1;
		if (!a.data.pinned && b.data.pinned) return 1;

		// 如果置顶状态相同，则按发布日期排序（最新的在前）
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);

		// 如果发布日期不同，则按日期排序
		if (dateA.getTime() !== dateB.getTime()) {
			return dateA > dateB ? -1 : 1;
		}

		// 如果发布日期相同，则按order字段排序（数字小的在前）
		const orderA =
			typeof a.data.order !== "undefined"
				? a.data.order
				: Number.MAX_SAFE_INTEGER;
		const orderB =
			typeof b.data.order !== "undefined"
				? b.data.order
				: Number.MAX_SAFE_INTEGER;

		return orderA - orderB; // 按order升序（数字小的在前）
	});

	// 返回原始的post对象
	return sorted.map((post) => post);
}

/**
 * 获取按阅读时间排序的文章（用于热门文章）
 * @returns Promise<CollectionEntry<"posts">[]>
 */
export async function getPopularPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// 先渲染所有文章以获取阅读时间数据，并计算推荐分数
	const postsWithScore = await Promise.all(
		allBlogPosts.map(async (post) => {
			// 渲染文章内容以获取frontmatter中的阅读时间数据
			const { remarkPluginFrontmatter } = await render(post);
			const readingTime = remarkPluginFrontmatter.minutes || 0;

			// 计算发布天数
			const now = new Date();
			const published = new Date(post.data.published);
			const daysSincePublished = Math.max(
				0,
				(now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24),
			);

			// 计算热度分数
			// 基础分：阅读时间（假设内容越长越有深度）
			// 时间衰减：使用半衰期模型，假设每 180 天热度减半
			// 这样可以避免老旧的长文永远霸榜，给新文章更多展示机会
			const halfLifeDays = 180;
			const timeDecayFactor = 1 / (1 + daysSincePublished / halfLifeDays);

			const score = readingTime * timeDecayFactor;

			return {
				...post,
				readingTime,
				score,
			};
		}),
	);

	// 排序
	const sorted = postsWithScore.sort((a, b) => {
		// 1. 优先显示置顶文章 (pinned)
		// 如果你希望某篇文章强制显示在热门列表顶部，可以在 frontmatter 中设置 pinned: true
		if (a.data.pinned && !b.data.pinned) return -1;
		if (!a.data.pinned && b.data.pinned) return 1;

		// 2. 按计算出的热度分数排序（从高到低）
		if (Math.abs(a.score - b.score) > 0.01) {
			return b.score - a.score;
		}

		// 3. 分数相同时，按发布日期排序（最新的在前）
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);

		if (dateA.getTime() !== dateB.getTime()) {
			return dateA > dateB ? -1 : 1;
		}

		// 4. 最后兜底：按order字段排序
		const orderA =
			typeof a.data.order !== "undefined"
				? a.data.order
				: Number.MAX_SAFE_INTEGER;
		const orderB =
			typeof b.data.order !== "undefined"
				? b.data.order
				: Number.MAX_SAFE_INTEGER;

		return orderA - orderB;
	});

	// 返回原始的post对象
	return sorted.map((post) => post);
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].id;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].id;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	id: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

export type CategoryWithPosts = {
	name: string;
	count: number;
	posts: CollectionEntry<"posts">[];
};

export async function getCategoriesWithPosts(): Promise<CategoryWithPosts[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const categories: { [key: string]: CategoryWithPosts } = {};

	allBlogPosts.forEach((post) => {
		let categoryName = post.data.category;
		if (!categoryName) {
			categoryName = i18n(I18nKey.uncategorized);
		}

		if (typeof categoryName !== "string") {
			categoryName = String(categoryName);
		}

		categoryName = categoryName.trim();

		if (!categories[categoryName]) {
			categories[categoryName] = {
				name: categoryName,
				count: 0,
				posts: [],
			};
		}

		categories[categoryName].count++;
		categories[categoryName].posts.push(post);
	});

	// 将分类转换为数组并排序
	return Object.values(categories).sort((a, b) => {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
}

/**
 * 获取标签的颜色类，基于标签频率
 * @param count 标签计数
 * @param max 最大计数
 * @returns 颜色类名
 */
export function getTagColorClass(count: number, max: number): string {
	const ratio = count / max;
	if (ratio > 0.8) return "tag-high";
	if (ratio > 0.6) return "tag-medium-high";
	if (ratio > 0.4) return "tag-medium";
	if (ratio > 0.2) return "tag-medium-low";
	return "tag-low";
}

/**
 * 计算标签的字体大小，基于标签频率
 * @param count 标签计数
 * @param max 最大计数
 * @param min 最小计数
 * @returns 字体大小 (rem)
 */
export function getTagFontSize(
	count: number,
	max: number,
	min: number,
): number {
	// 将计数值规范化到 0-1 之间
	const normalized = (count - min) / (max - min || 1);
	// 映射到 0.9rem 到 2rem 之间的字体大小
	return 0.9 + normalized * 1.1;
}

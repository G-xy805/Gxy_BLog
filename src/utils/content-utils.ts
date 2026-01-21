import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		// 首先按置顶状态排序，置顶文章在前
		if (a.data.pinned && !b.data.pinned) return -1;
		if (!a.data.pinned && b.data.pinned) return 1;

		// 如果置顶状态相同，则按发布日期排序
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
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
	if (ratio > 0.8)
		return "tag-high";
	if (ratio > 0.6)
		return "tag-medium-high";
	if (ratio > 0.4)
		return "tag-medium";
	if (ratio > 0.2)
		return "tag-medium-low";
	return "tag-low";
}

/**
 * 计算标签的字体大小，基于标签频率
 * @param count 标签计数
 * @param max 最大计数
 * @param min 最小计数
 * @returns 字体大小 (rem)
 */
export function getTagFontSize(count: number, max: number, min: number): number {
	// 将计数值规范化到 0-1 之间
	const normalized = (count - min) / (max - min || 1);
	// 映射到 0.9rem 到 2rem 之间的字体大小
	return 0.9 + normalized * 1.1;
}

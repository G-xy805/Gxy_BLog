<script lang="ts">
import { onMount } from "svelte";


import { getPostUrlBySlug } from "@/utils/url-utils";
import Icon from "@iconify/svelte";

export let sortedPosts: Post[] = [];

interface Post {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string;
		published: Date;
	};
}

interface MonthGroup {
	month: string;
	posts: Post[];
}

interface Group {
	year: number;
	months: MonthGroup[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatMonth(date: Date) {
	const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
	return months[date.getMonth()];
}



onMount(async () => {
	// 按发布时间倒序排序，确保不受置顶影响
	const filteredPosts = sortedPosts
		.slice()
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

	// 按年份和月份分组
	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			const month = (post.data.published.getMonth() + 1).toString().padStart(2, "0");
			if (!acc[year]) {
				acc[year] = {};
			}
			if (!acc[year][month]) {
				acc[year][month] = [];
			}
			acc[year][month].push(post);
			return acc;
		},
		{} as Record<number, Record<string, Post[]>>,
	);

	// 转换为数组并按年份和月份排序
	const groupedPostsArray = Object.keys(grouped)
		.map((yearStr) => {
			const year = Number.parseInt(yearStr, 10);
			const months = Object.keys(grouped[year])
				.sort((a, b) => parseInt(b) - parseInt(a))
				.map((monthStr) => ({
					month: monthStr,
					posts: grouped[year][monthStr],
				}));
			return {
				year,
				months,
			};
		})
		.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
});
</script>

<div class="card-base p-4 sm:p-6">
    <div class="archives-timeline">
        {#each groups as group}
            <div class="timeline-year">
                <div class="year-header">
                    <div class="year-badge">{group.year}</div>
                </div>

                <div class="year-content">
                    {#each group.months as monthGroup}
                        <div class="timeline-month">
                            <h3 class="month-title">
                                <Icon icon="feather:calendar" class="month-icon" />
                                <span>
                                    {formatMonth(monthGroup.posts[0].data.published)} {group.year}
                                </span>
                                <span class="month-count">{monthGroup.posts.length}</span>
                            </h3>

                            <ul class="archive-posts">
                                {#each monthGroup.posts as post}
                                    <li class="archive-item">
                                        <a
                                                href={getPostUrlBySlug(post.id)}
                                                aria-label={post.data.title}
                                                class="archive-card"
                                        >
                                            <time class="archive-date">{formatDate(post.data.published)}</time>
                                            <h4 class="archive-title">{post.data.title}</h4>
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

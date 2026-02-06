<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import { getPostUrlBySlug } from "@/utils/url-utils";

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
	days: DayGroup[];
}

interface DayGroup {
	day: string;
	date: Date;
	posts: Post[];
}

interface Group {
	year: number;
	months: MonthGroup[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function formatDay(date: Date) {
	return date.getDate().toString().padStart(2, "0");
}

function formatMonth(date: Date) {
	const months = [
		"一月",
		"二月",
		"三月",
		"四月",
		"五月",
		"六月",
		"七月",
		"八月",
		"九月",
		"十月",
		"十一月",
		"十二月",
	];
	return months[date.getMonth()];
}

onMount(async () => {
	// 按发布时间倒序排序
	const filteredPosts = sortedPosts
		.slice()
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

	// 按年份、月份和日期分组
	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			const month = (post.data.published.getMonth() + 1)
				.toString()
				.padStart(2, "0");
			const day = post.data.published.getDate().toString().padStart(2, "0");

			if (!acc[year]) {
				acc[year] = {};
			}
			if (!acc[year][month]) {
				acc[year][month] = {};
			}
			if (!acc[year][month][day]) {
				acc[year][month][day] = [];
			}
			acc[year][month][day].push(post);
			return acc;
		},
		{} as Record<number, Record<string, Record<string, Post[]>>>,
	);

	// 转换为数组并排序
	const groupedPostsArray = Object.keys(grouped)
		.map((yearStr) => {
			const year = Number.parseInt(yearStr, 10);
			const months = Object.keys(grouped[year])
				.sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10))
				.map((monthStr) => {
					const days = Object.keys(grouped[year][monthStr])
						.sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10))
						.map((dayStr) => {
							const posts = grouped[year][monthStr][dayStr];
							return {
								day: dayStr,
								date: posts[0].data.published,
								posts: posts,
							};
						});

					return {
						month: monthStr,
						days: days,
					};
				});

			return {
				year,
				months,
			};
		})
		.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
});
</script>

<div class="w-full">
    <div class="archives-timeline">
        {#each groups as group}
            <div class="timeline-year">
                <div class="year-header">
                    <div class="year-badge text-3xl font-bold text-gray-900 dark:text-white opacity-10 mb-2 select-none pointer-events-none absolute -left-2 -top-6">{group.year}</div>
                </div>

                <div class="year-content pt-4">
                    {#each group.months as monthGroup}
                        <div class="timeline-month">
                            <h3 class="month-title">
                                <Icon icon="ri:calendar-line" class="month-icon" />
                                <span>
                                    {formatMonth(monthGroup.days[0].date)}
                                </span>
                                <span class="month-count">{monthGroup.days.reduce((total, day) => total + day.posts.length, 0)} 篇文章</span>
                            </h3>

                            <div class="archive-month-content">
                                {#each monthGroup.days as dayGroup}
                                    <div class="day-section mb-6 last:mb-0 relative">
                                        <!-- Day Header -->
                                        <div class="day-group-header flex items-center gap-2 mb-3 sticky top-[4.5rem] z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm py-1 rounded-r-lg w-fit pr-3">
                                            <div class="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]"></div>
                                            <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {formatDate(dayGroup.date)}
                                            </span>
                                        </div>

									<!-- Posts Grid for this Day -->
									<div class="day-posts grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pl-4 border-l-2 border-dashed border-gray-100 dark:border-gray-800 pb-2 ml-1 pr-2">
                                            {#each dayGroup.posts as post}
                                                <div class="archive-item w-full min-w-0">
                                                    <a
                                                            href={getPostUrlBySlug(post.id)}
                                                            aria-label={post.data.title}
													class="archive-card group flex flex-col h-full min-h-[110px] max-w-[26rem]"
                                                    >
                                                        <h4 class="archive-title group-hover:text-[var(--primary)] transition-colors text-lg font-bold mb-3 break-words leading-relaxed">{post.data.title}</h4>
                                                        
                                                        <div class="archive-meta flex items-center justify-between mt-auto pt-3 border-t border-gray-50 dark:border-gray-800/50">
                                                            {#if post.data.tags && post.data.tags.length > 0}
                                                                <div class="archive-tags flex flex-wrap gap-1.5">
                                                                    {#each post.data.tags.slice(0, 3) as tag}
                                                                        <span class="archive-tag text-[10px] px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                                                            #{tag}
                                                                        </span>
                                                                    {/each}
                                                                    {#if post.data.tags.length > 3}
                                                                        <span class="text-[10px] text-gray-400">+{post.data.tags.length - 3}</span>
                                                                    {/if}
                                                                </div>
                                                            {/if}
                                                        </div>
                                                    </a>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig, siteConfig } from "./src/config";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import mdx from "@astrojs/mdx";
import searchIndexer from "./src/integrations/searchIndex.mts";
// https://astro.build/config
export default defineConfig({
<<<<<<< HEAD
  site: USER_SITE,
  output: "static",
  viewTransitions: {
    enabled: true,
  },
  style: {
    scss: {
      includePaths: ["./src/styles"],
    },
  },
  integrations: [
    updateConfig(),
    mdx(),
    icon(),
    terser({
      compress: true,
      mangle: true,
    }),
    sitemap(),
    tailwind({
      configFile: "./tailwind.config.mjs",
    }),
    playformCompress(),
  ],
  markdown: {
    shikiConfig: {
      theme: CODE_THEME,
      transformers: [{
        preprocess(code, options) {
          this.meta = { lang: options.lang || "plaintext" };
          return code;
        },
        pre(node) {
          const language = this.meta?.lang.toUpperCase() || "plaintext";

          return {
            type: "element",
            tagName: "div",
            properties: {
              class: "not-prose ryuchan-code",
            },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: {
                  class: "ryuchan-code-toolbar",
                },
                children: [
                  {
                    type: "element",
                    tagName: "span",
                    properties: { class: "ryuchan-code-toolbar-language" },
                    children: [{ type: "text", value: language }],
                  },
                  {
                    type: "element",
                    tagName: "button",
                    properties: {
                      "class": "btn-copy",
                      "aria-label": "Copy code",
                      "type": "button",
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "span",
                        properties: {
                          "class": "ryuchan-code-toolbar-copy-icon",
                          "aria-hidden": "true",
                        },
                        children: [
                          {
                            type: "element",
                            tagName: "svg",
                            properties: {
                              "xmlns": "http://www.w3.org/2000/svg",
                              "width": "18",
                              "height": "18",
                              "viewBox": "0 0 24 24",
                              "fill": "none",
                              "stroke": "currentColor",
                              "stroke-width": "2",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "class": "copy-icon",
                            },
                            children: [
                              {
                                type: "element",
                                tagName: "rect",
                                properties: {
                                  x: "9",
                                  y: "9",
                                  width: "13",
                                  height: "13",
                                  rx: "2",
                                  ry: "2",
                                },
                                children: [],
                              },
                              {
                                type: "element",
                                tagName: "path",
                                properties: {
                                  d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
                                },
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tagName: "span",
                        properties: {
                          "class": "ryuchan-code-toolbar-copy-success hidden",
                          "aria-hidden": "true",
                        },
                        children: [
                          {
                            type: "element",
                            tagName: "svg",
                            properties: {
                              "xmlns": "http://www.w3.org/2000/svg",
                              "width": "18",
                              "height": "18",
                              "viewBox": "0 0 24 24",
                              "fill": "none",
                              "stroke": "currentColor",
                              "stroke-width": "2",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "class": "success-icon",
                            },
                            children: [
                              {
                                type: "element",
                                tagName: "path",
                                properties: {
                                  d: "M20 6L9 17l-5-5",
                                },
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                ...node,
                properties: {
                  ...node.properties,
                  class: "ryuchan-code-content",
                },
                children: [
                  {
                    type: "element",
                    tagName: "code",
                    properties: {
                      class: "grid [&>.line]:px-4",
                      style: "counter-reset: line",
                    },
                    children: node.children,
                  },
                ],
              },
            ],
          };
        },
        line(node) {
          return {
            ...node,
            properties: {
              ...node.properties,
              class: "line before:content-[counter(line)]",
              style: "counter-increment: line",
            },
          };
        },
        code(node) {
          delete node.properties.style;
          return node;
        },
      },
      ],
    },
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex, [
      rehypeExternalLinks,
      {
        content: { type: "text", value: "↗" },
      },
    ]],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
=======
	site: siteConfig.site_url,

	base: "/",
	trailingSlash: "always",
	integrations: [
		tailwind({
			nesting: true,
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: ["main"],
			smoothScrolling: false,
			cache: true,
			preload: false,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			// 滚动相关配置优化
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				// 跳过锚点链接的处理，让浏览器原生处理
				return event.state && event.state.url && event.state.url.includes("#");
			},
		}),
		icon({
			include: {
				"preprocess: vitePreprocess(),": ["*"],
				"fa6-brands": ["*"],
				"fa6-regular": ["*"],
				"fa6-solid": ["*"],
				mdi: ["*"],
				feather: ["*"],
				ri: ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				// pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: false,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				borderRadius: "0.75rem",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte(),
		sitemap({
			filter: (page) => {
				// 根据页面开关配置过滤sitemap
				const url = new URL(page);
				const pathname = url.pathname;

				if (pathname === '/sponsor/' && !siteConfig.pages.sponsor) {
					return false;
				}
				if (pathname === '/guestbook/' && !siteConfig.pages.guestbook) {
					return false;
				}


				return true;
			},
		}),
    searchIndexer(),
    mdx()
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkGithubAdmonitionsToDirectives,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
			remarkMermaid,
		],
		rehypePlugins: [
			rehypeKatex,
			rehypeSlug,
			rehypeMermaid,
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) => AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
					},
				},
			],

		],
	},
	vite: {
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
	},
>>>>>>> 7049e02b4fb3113b4c46ed87c680b2a2cf84d75b
});

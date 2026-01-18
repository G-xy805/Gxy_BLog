<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import { DARK_MODE, LIGHT_MODE } from "@/constants/constants";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@/utils/setting-utils";

// Define Swup type for window object
interface SwupHooks {
	on(event: string, callback: () => void): void;
}

interface SwupInstance {
	hooks?: SwupHooks;
}

type WindowWithSwup = Window & { swup?: SwupInstance };

let mode: LIGHT_DARK_MODE = LIGHT_MODE;
let isSwitching = false;

function switchTheme() {
	if (isSwitching) return;

	isSwitching = true;
	const newMode = mode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
	mode = newMode;
	setTheme(newMode);

	// 动画完成后重置状态
	setTimeout(() => {
		isSwitching = false;
	}, 500);
}

// 使用onMount确保在组件挂载后正确初始化
onMount(() => {
	// 立即获取并设置正确的主题
	const storedTheme = getStoredTheme();
	mode = storedTheme;

	// 确保DOM状态与存储的主题一致
	const currentTheme = document.documentElement.classList.contains("dark")
		? DARK_MODE
		: LIGHT_MODE;
	if (storedTheme !== currentTheme) {
		applyThemeToDocument(storedTheme);
	}

	// 添加Swup监听
	const handleContentReplace = () => {
		const newTheme = getStoredTheme();
		mode = newTheme;
	};

	// 检查Swup是否已经加载
	const win = window as WindowWithSwup;
	if (win.swup?.hooks) {
		win.swup.hooks.on("content:replace", handleContentReplace);
	} else {
		document.addEventListener("swup:enable", () => {
			const w = window as WindowWithSwup;
			if (w.swup?.hooks) {
				w.swup.hooks.on("content:replace", handleContentReplace);
			}
		});
	}

	// 监听主题变化事件
	const handleThemeChange = () => {
		const newTheme = getStoredTheme();
		mode = newTheme;
	};

	window.addEventListener("theme-change", handleThemeChange);

	// 清理函数
	return () => {
		window.removeEventListener("theme-change", handleThemeChange);
	};
});
</script>

<button 
    aria-label="Light/Dark Mode" 
    class="btn-plain scale-animation rounded-full h-11 w-11 active:scale-90 flex items-center justify-center theme-switch-btn {isSwitching ? 'switching' : ''} ml-3 mr-1"
    on:click={switchTheme}
    disabled={isSwitching}
    title={mode === LIGHT_MODE ? '切换到深色模式' : '切换到浅色模式'}
>
    <div class="absolute icon-transition" class:opacity-0={mode !== LIGHT_MODE}>
        <Icon icon="feather:sun" class="text-[1.25rem] text-[var(--primary)]"></Icon>
    </div>
    <div class="absolute icon-transition" class:opacity-0={mode !== DARK_MODE}>
        <Icon icon="feather:moon" class="text-[1.25rem] text-[var(--primary)]"></Icon>
    </div>
</button>

<style>
    /* 确保主题切换按钮的背景色即时更新 */
    .theme-switch-btn::before {
        transition: transform 75ms ease-out, background-color 0ms !important;
    }

    /* 图标过渡动画 */
    .icon-transition {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    }

    /* 切换中的按钮动画 */
    .switching {
        pointer-events: none;
    }

    .switching .icon-transition {
        animation: iconRotate 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes iconRotate {
        0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
        }
        50% {
            transform: rotate(180deg) scale(0.8);
            opacity: 0.5;
        }
        100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
        }
    }

    /* 悬停效果增强 */
    .theme-switch-btn:not(.switching):hover .icon-transition {
        transform: scale(1.1);
    }

    /* 按钮禁用状态 */
    .theme-switch-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>
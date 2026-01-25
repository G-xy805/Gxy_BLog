<script lang="ts">
import { onMount, onDestroy } from "svelte";
import { siteConfig } from "@/config";
import { layoutMode } from "@/stores/settingsStore";
import { BREAKPOINTS } from "@/constants/layoutConstants";
import { useSwitchAnimation } from "@/hooks/useSwitchAnimation";

let mounted = false;
let isSmallScreen = false;
const { toggle: toggleLayout, isSwitching } = useSwitchAnimation(() => {
	if (!mounted || isSmallScreen) return;
	
	const newMode = $layoutMode === 'list' ? 'grid' : 'list';
	layoutMode.set(newMode);
}, 500);

function checkScreenSize() {
	isSmallScreen = window.innerWidth < BREAKPOINTS.DESKTOP;
	if (isSmallScreen) {
		layoutMode.set('list');
	}
}

function handleKeyboardEvent(event: KeyboardEvent) {
	if (event.key === 'Enter' || event.key === ' ') {
		toggleLayout();
	}
}

onMount(() => {
	mounted = true;
	checkScreenSize();
	
	window.addEventListener("resize", checkScreenSize);
	window.addEventListener('keydown', handleKeyboardEvent);
	
	return () => {
		window.removeEventListener("resize", checkScreenSize);
		window.removeEventListener('keydown', handleKeyboardEvent);
	};
});
</script>

{#if mounted && siteConfig.postListLayout.allowSwitch && !isSmallScreen}
  <button 
    aria-label="切换文章列表布局"
    aria-pressed={$layoutMode === 'grid'}
    role="switch"
    class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center theme-switch-btn {isSwitching ? 'switching' : ''}" 
    on:click={switchLayout}
    disabled={isSwitching}
    title={$layoutMode === 'list' ? '切换到网格模式' : '切换到列表模式'}
    >
      {#if $layoutMode === 'list'}
        <!-- 列表图标 -->
        <svg class="w-5 h-5 icon-transition" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
        </svg>
      {:else}
      <!-- 网格图标 -->
      <svg class="w-5 h-5 icon-transition" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
      </svg>
      {/if}
  </button>
{/if}

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

<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { onMount, onDestroy } from "svelte";
import { DARK_MODE, LIGHT_MODE } from "@/constants/constants";
import { theme } from "@/stores/settingsStore";
import { applyThemeToDocument } from "@/utils/setting-utils";
import { useSwitchAnimation } from "@/hooks/useSwitchAnimation";

const { toggle: toggleTheme, isSwitching } = useSwitchAnimation(() => {
	const newMode = $theme === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
	theme.set(newMode);
	applyThemeToDocument(newMode);
}, 500);

function handleKeyboardEvent(event: KeyboardEvent) {
	if (event.key === 'Enter' || event.key === ' ') {
		toggleTheme();
	}
}

onMount(() => {
	applyThemeToDocument($theme);
	window.addEventListener('keydown', handleKeyboardEvent);
});

onDestroy(() => {
	window.removeEventListener('keydown', handleKeyboardEvent);
});
</script>

<button 
    aria-label="Light/Dark Mode" 
    aria-pressed={$theme === DARK_MODE}
    role="switch"
    class="btn-plain scale-animation rounded-full h-11 w-11 active:scale-90 flex items-center justify-center theme-switch-btn {isSwitching ? 'switching' : ''} ml-3 mr-1 relative overflow-hidden group"
    on:click={switchTheme}
    disabled={isSwitching}
    title={$theme === LIGHT_MODE ? '切换到深色模式' : '切换到浅色模式'}
>
    <!-- 背景渐变效果 -->
    <div class="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
    
    <!-- 光晕效果 -->
    <div class="absolute inset-0 rounded-full bg-[var(--primary)]/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md scale-0 group-hover:scale-150"></div>
    
    <div class="absolute icon-transition" class:opacity-0={mode !== LIGHT_MODE}>
        <Icon icon="ri:sun-line" class="text-[1.25rem] text-[var(--primary)]"></Icon>
    </div>
    <div class="absolute icon-transition" class:opacity-0={mode !== DARK_MODE}>
        <Icon icon="ri:moon-line" class="text-[1.25rem] text-[var(--primary)]"></Icon>
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
        transform: scale(1.15);
    }

    /* 按钮禁用状态 */
    .theme-switch-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>
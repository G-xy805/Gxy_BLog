/**
 * 导航栏脚本
 * 处理导航栏的交互逻辑，包括菜单切换、智能显示/隐藏等功能
 */

// 菜单切换逻辑
export function initMenuSwitch() {
    const menuBtn = document.getElementById("nav-menu-switch");
    const menuPanel = document.getElementById("nav-menu-panel");

    if (menuBtn && menuPanel) {
        // 切换菜单状态
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (menuPanel.classList.contains("float-panel-closed")) {
                openMenu();
            } else {
                closeMenu();
            }
        });

        // 打开菜单
        function openMenu() {
            menuPanel.classList.remove("float-panel-closed");
            menuBtn.setAttribute("aria-expanded", "true");
            menuBtn.classList.add("active"); // 添加激活状态样式
            
            // 添加菜单打开动画
            menuPanel.style.opacity = "0";
            menuPanel.style.transform = "translateY(-10px)";
            
            setTimeout(() => {
                menuPanel.style.opacity = "1";
                menuPanel.style.transform = "translateY(0)";
            }, 10);
            
            // 延迟添加监听器，防止立即触发
            setTimeout(() => {
                document.addEventListener('click', closeMenuOutside);
                document.addEventListener('keydown', closeMenuEsc);
            }, 0);
        }

        // 关闭菜单
        function closeMenu() {
            // 添加菜单关闭动画
            menuPanel.style.opacity = "1";
            menuPanel.style.transform = "translateY(0)";
            
            setTimeout(() => {
                menuPanel.style.opacity = "0";
                menuPanel.style.transform = "translateY(-10px)";
            }, 10);
            
            setTimeout(() => {
                menuPanel.classList.add("float-panel-closed");
                menuBtn.setAttribute("aria-expanded", "false");
                menuBtn.classList.remove("active");
                
                document.removeEventListener('click', closeMenuOutside);
                document.removeEventListener('keydown', closeMenuEsc);
            }, 300);
        }

        // 点击外部关闭
        function closeMenuOutside(e) {
            if (!menuPanel.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        }

        // ESC键关闭
        function closeMenuEsc(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        }
    }
}

// 导航栏逻辑（始终显示，取消自动隐藏功能）
export function initSmartNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // 检测是否支持 hover (区分移动端和桌面端)
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    
    // 初始化 ARIA 状态，始终设置为可见
    navbar.setAttribute('aria-hidden', 'false');

    // 无论是否为移动端，都让导航栏始终显示
    function showNavbar() {
        // 确保导航栏可见
        navbar.classList.add('navbar-visible');
        navbar.setAttribute('aria-hidden', 'false');
        
        // 移除任何可能的隐藏动画样式
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
    }

    // 立即显示导航栏
    showNavbar();

    // 移除所有可能的隐藏相关事件监听器
    // 由于无法直接移除之前添加的事件监听器，我们通过覆盖样式和状态来确保导航栏始终显示
    
    // 确保导航栏在页面加载和滚动时始终显示
    window.addEventListener('load', showNavbar);
    window.addEventListener('scroll', showNavbar);
    window.addEventListener('resize', showNavbar);

    // 为了确保导航栏始终显示，我们可以添加一个样式规则来强制显示
    const style = document.createElement('style');
    style.textContent = `
        #navbar {
            display: flex !important;
            transform: translateY(0) !important;
            opacity: 1 !important;
        }
        
        #navbar.navbar-visible {
            display: flex !important;
        }
    `;
    document.head.appendChild(style);
}


// 滚动事件处理
export function initScrollEvents() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // 初始状态
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // 节流函数
    function throttle(func, delay) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, delay);
            }
        };
    }

    // 添加节流后的滚动事件监听器
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 50) {
            if (!navbar.classList.contains('scrolled')) {
                navbar.classList.add('scrolled');
            }
        } else {
            if (navbar.classList.contains('scrolled')) {
                navbar.classList.remove('scrolled');
            }
        }
    }, 100));
}

// 初始化所有导航栏功能
export function initNavbar() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMenuSwitch();
            initSmartNavbar();
            initScrollEvents();
        });
    } else {
        initMenuSwitch();
        initSmartNavbar();
        initScrollEvents();
    }
}

// 导出默认函数
initNavbar();

// ============================================
// Theme Management
// ============================================
const ThemeManager = {
    init() {
        this.toggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    },
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    },
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },
    
    bindEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
};

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
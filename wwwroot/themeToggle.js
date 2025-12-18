const htmlElement = document.documentElement;

// Get the button image path for a given theme
function getThemeButtonImagePath(theme) {
    return theme === 'light' ? 'images/LightThemeButton.png' : 'images/DarkThemeButton.png';
}

// Apply theme to HTML element (can be called before body loads)
function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Update button image (must be called after button exists)
function updateButtonImage(theme) {
    const toggleButton = document.getElementById('themeToggle');
    if (toggleButton) {
        toggleButton.setAttribute('src', getThemeButtonImagePath(theme));
    }
}

// Get saved theme or return default
function getSavedTheme() {
    return localStorage.getItem('theme') || 'light';
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Function to set the theme (applies theme and updates button)
function setTheme(theme) {
    applyTheme(theme);
    updateButtonImage(theme);
}
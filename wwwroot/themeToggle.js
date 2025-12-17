const htmlElement = document.documentElement;

// function to load theme if saved in localStorage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) { setTheme(savedTheme); }
    else { setTheme('light'); } // Default theme
}

// function to toggle theme
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Function to set the theme
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Save preference
    // set button image based on theme
    toggleButton = document.getElementById('themeToggle');
    if (!toggleButton) { throw new Error('No element with ID "themeToggle" found'); }
    else { toggleButton.setAttribute('src', theme === 'light' ? 'images/LightThemeButton.png' : 'images/DarkThemeButton.png'); }
}
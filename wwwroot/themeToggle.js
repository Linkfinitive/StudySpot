const htmlElement = document.documentElement;
const toggleButton = document.getElementById('themeToggle');
if (!toggleButton) { throw new Error('No element with ID "themeToggle" found'); }
else {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // Toggle theme on button click
    toggleButton.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// Function to set the theme
function setTheme(theme) {
    if (!toggleButton) { throw new Error('No element with ID "themeToggle" found'); }
    else {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Save preference
        toggleButton.setAttribute('src', theme === 'light' ? 'images/LightThemeButton.png' : 'images/DarkThemeButton.png');
    }
}
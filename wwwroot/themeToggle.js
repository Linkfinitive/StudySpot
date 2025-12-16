// Function to set the theme
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Save preference
    toggleButton.setAttribute('src', theme === 'light' ? 'images/LightThemeButton.png' : 'images/DarkThemeButton.png');
}

const htmlElement = document.documentElement;
const toggleButton = document.getElementById('themeToggle');

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
// /static/theme.js

document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    const moonIcon = 'fa-moon';
    const sunIcon = 'fa-sun';

    // Function to apply the saved theme and update the icon
    const applyTheme = () => {
        // 1. Check localStorage for a saved theme
        const savedTheme = localStorage.getItem('theme');
        const iconElement = themeSwitch.querySelector('i');

        if (savedTheme === 'dark') {
            // 2. If 'dark' is saved, apply the dark-theme class
            body.classList.add('dark-theme');
            iconElement.classList.remove(moonIcon);
            iconElement.classList.add(sunIcon);
        } else {
            // 3. Otherwise, use the light theme (default)
            body.classList.remove('dark-theme');
            iconElement.classList.remove(sunIcon);
            iconElement.classList.add(moonIcon);
        }
    };

    // Event listener for the theme switch button
    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('dark-theme'); // Toggle the theme on the body
        const iconElement = themeSwitch.querySelector('i');

        // Check which theme is now active and save it to localStorage
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            iconElement.classList.remove(moonIcon);
            iconElement.classList.add(sunIcon);
        } else {
            localStorage.setItem('theme', 'light');
            iconElement.classList.remove(sunIcon);
            iconElement.classList.add(moonIcon);
        }
    });

    // Apply the theme as soon as the page loads
    applyTheme();
});
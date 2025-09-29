document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");
    if (!themeSwitch) return;

    const sunIcon = `<i class="fas fa-sun"></i>`;
    const moonIcon = `<i class="fas fa-moon"></i>`;
    const currentTheme = localStorage.getItem("theme");

    function setTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark-theme");
            themeSwitch.innerHTML = sunIcon;
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            themeSwitch.innerHTML = moonIcon;
            localStorage.setItem("theme", "light");
        }
    }

    // Set initial theme on page load
    if (currentTheme) {
        setTheme(currentTheme);
    } else {
        setTheme("light"); // Default to light theme
    }

    // Add click listener
    themeSwitch.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
        setTheme(newTheme);
    });
});


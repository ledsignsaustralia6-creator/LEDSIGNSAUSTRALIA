function toggleMenu() {
    const nav = document.getElementById("navMenu");
    nav.classList.toggle("nav-open");
}

// Close the menu automatically if user resizes back to desktop width
window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        document.getElementById("navMenu").classList.remove("nav-open");
    }
});

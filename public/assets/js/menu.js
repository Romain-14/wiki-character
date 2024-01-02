const toggleMenuBtn = document.querySelector("#toggle-menu");
const menu = document.querySelector("#menu");

toggleMenuBtn.addEventListener("click", () => {
    menu.classList.toggle("hide");
});


const navLinks = document.querySelectorAll('#menu a');

const currentUrl = window.location.pathname;

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentUrl) {
        link.setAttribute('aria-current', 'page');
        link.setAttribute('class', 'active');
    } else {
        link.removeAttribute('aria-current');
        link.removeAttribute('class', 'active');
    }
});
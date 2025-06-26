function initializeHeader() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    console.log('헤더 js 로드 됨');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            console.log('메뉴버튼 클릭');
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (menuOverlay) menuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMenu);
        } else {
            console.error('Menu toggle or nav links not found');
        }
    }
}

function closeMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle && navLinks) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}
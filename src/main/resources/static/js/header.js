function initializeHeader() {
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');
	const menuOverlay = document.querySelector('.menu-overlay');

	if (menuToggle && navLinks) {
		menuToggle.addEventListener('click', function() {
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
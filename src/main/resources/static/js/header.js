function initializeHeader() {
	console.log('initializeHeader 함수 시작');
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');
	const menuOverlay = document.querySelector('.menu-overlay');
	document.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', function(e) {
			e.stopPropagation();
			console.log('링크 클릭됨:', this.href || 'href 없음');
		});
	});

	document.addEventListener('click', function(e) {
		if (e.target.tagName === 'A') {
			console.log('문서 내 링크 클릭됨:', e.target.href);
		}
	});
	document.querySelectorAll('.logo a').forEach(link => {
		link.addEventListener('click', function(e) {
			console.log('로고 링크 클릭됨:', this.href || 'href 없음');
		});
	});


	console.log('menuToggle:', menuToggle);
	console.log('navLinks:', navLinks);
	console.log('menuOverlay:', menuOverlay);

	if (menuToggle && navLinks) {
		menuToggle.addEventListener('click', function() {
			console.log('메뉴 토글 클릭됨');
			menuToggle.classList.toggle('active');
			navLinks.classList.toggle('active');
			if (menuOverlay) menuOverlay.classList.toggle('active');
			document.body.classList.toggle('menu-open');
		});

		navLinks.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', function(e) {
				console.log('네비게이션 링크 클릭됨:', e.target.href);
				closeMenu(e);
			});
		});

		if (menuOverlay) {
			menuOverlay.addEventListener('click', closeMenu);
		}
	}

	console.log('initializeHeader 함수 종료');
}

function closeMenu(e) {
	console.log('closeMenu 함수 호출됨');
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');
	const menuOverlay = document.querySelector('.menu-overlay');

	if (menuToggle && navLinks) {
		menuToggle.classList.remove('active');
		navLinks.classList.remove('active');
		if (menuOverlay) menuOverlay.classList.remove('active');
		document.body.classList.remove('menu-open');
	}

	if (e && e.target.tagName === 'A') {
		console.log('A 태그 클릭됨, 이벤트 버블링 방지');
		e.stopPropagation(); // 이벤트 버블링 방지
	}
}

document.addEventListener('DOMContentLoaded', function() {
	console.log('Header: DOMContentLoaded 이벤트 발생');
	initializeHeader();
});

console.log('header.js 로드 완료');

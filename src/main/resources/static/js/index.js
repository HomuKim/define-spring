document.addEventListener('DOMContentLoaded', function() {
	const slides = document.querySelectorAll('.event-image');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');
	let currentSlide = 0;
	let slideInterval;

	function showSlide(index) {
		slides.forEach(slide => slide.classList.remove('active'));
		slides[index].classList.add('active');
	}

	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
		showSlide(currentSlide);
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + slides.length) % slides.length;
		showSlide(currentSlide);
	}

	function startSlideShow() {
		stopSlideShow(); // 기존 인터벌 제거
		slideInterval = setInterval(nextSlide, 15000); // 15초마다 슬라이드 전환
	}

	function stopSlideShow() {
		if (slideInterval) {
			clearInterval(slideInterval);
		}
	}

	// 초기 슬라이드 표시 및 자동 슬라이드 시작
	showSlide(currentSlide);
	startSlideShow();

	// 버튼 이벤트 리스너
	prevBtn.addEventListener('click', () => {
		prevSlide();
		startSlideShow(); // 버튼 클릭 후 자동 슬라이드 재시작
	});

	nextBtn.addEventListener('click', () => {
		nextSlide();
		startSlideShow(); // 버튼 클릭 후 자동 슬라이드 재시작
	});

	// 마우스 호버 시 자동 슬라이드 정지
	document.querySelector('.event-banner').addEventListener('mouseenter', stopSlideShow);
	document.querySelector('.event-banner').addEventListener('mouseleave', startSlideShow);
});

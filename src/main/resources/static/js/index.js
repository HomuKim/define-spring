document.addEventListener('DOMContentLoaded', function() {
	console.log('Index: DOMContentLoaded 이벤트 발생');

	const slides = document.querySelectorAll('.event-image');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');
	let currentSlide = 0;
	let slideInterval;

	console.log('슬라이드 개수:', slides.length);
	console.log('이전 버튼:', prevBtn);
	console.log('다음 버튼:', nextBtn);

	function showSlide(index) {
		console.log('showSlide 함수 실행, 인덱스:', index);
		slides.forEach(slide => slide.classList.remove('active'));
		slides[index].classList.add('active');
	}

	function nextSlide() {
		console.log('nextSlide 함수 실행');
		currentSlide = (currentSlide + 1) % slides.length;
		showSlide(currentSlide);
	}

	function prevSlide() {
		console.log('prevSlide 함수 실행');
		currentSlide = (currentSlide - 1 + slides.length) % slides.length;
		showSlide(currentSlide);
	}

	function startSlideShow() {
		console.log('startSlideShow 함수 실행');
		stopSlideShow(); // 기존 인터벌 제거
		slideInterval = setInterval(nextSlide, 15000); // 15초마다 슬라이드 전환
	}

	function stopSlideShow() {
		console.log('stopSlideShow 함수 실행');
		if (slideInterval) {
			clearInterval(slideInterval);
		}
	}

	// 초기 슬라이드 표시 및 자동 슬라이드 시작
	showSlide(currentSlide);
	startSlideShow();

	// 버튼 이벤트 리스너
	if (prevBtn) {
		prevBtn.addEventListener('click', () => {
			console.log('이전 버튼 클릭');
			prevSlide();
			startSlideShow(); // 버튼 클릭 후 자동 슬라이드 재시작
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			console.log('다음 버튼 클릭');
			nextSlide();
			startSlideShow(); // 버튼 클릭 후 자동 슬라이드 재시작
		});
	}

	// 마우스 호버 시 자동 슬라이드 정지
	const eventBanner = document.querySelector('.event-banner');
	if (eventBanner) {
		eventBanner.addEventListener('mouseenter', () => {
			console.log('이벤트 배너에 마우스 진입');
			stopSlideShow();
		});
		eventBanner.addEventListener('mouseleave', () => {
			console.log('이벤트 배너에서 마우스 이탈');
			startSlideShow();
		});
	}

	document.querySelectorAll('.card').forEach(card => {
		card.addEventListener('click', function(e) {
			console.log('Card clicked:', this.href);
		});
	});

	console.log('Index: DOMContentLoaded 이벤트 리스너 종료');
});

// 모든 a 태그에 이벤트 리스너 추가
document.querySelectorAll('a').forEach(link => {
	link.addEventListener('click', function(e) {
		console.log('링크 클릭됨:', e.target.href);
	});
});

// 문서 전체에 이벤트 위임 사용
document.addEventListener('click', function(e) {
	if (e.target.tagName === 'A') {
		console.log('문서 내 링크 클릭됨:', e.target.href);
	}
});

console.log('index.js 로드 완료');

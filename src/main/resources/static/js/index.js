// 슬라이드 인덱스 초기화
let slideIndex = 0;
const slides = document.querySelectorAll('.event-image');

// 유효한 이미지만 필터링하는 함수
function filterValidImages() {
	return Array.from(slides).filter(slide => {
		return slide.complete && slide.naturalHeight !== 0;
	});
}

// 슬라이드쇼 기능
function showSlides() {
	const validSlides = filterValidImages();

	if (validSlides.length === 0) return;

	// 모든 슬라이드 숨기기
	validSlides.forEach(slide => {
		slide.style.display = "none";
		slide.classList.remove('active');
	});

	// 다음 슬라이드 표시
	slideIndex++;
	if (slideIndex > validSlides.length) {
		slideIndex = 1;
	}

	validSlides[slideIndex - 1].style.display = "block";
	validSlides[slideIndex - 1].classList.add('active');

	// 7초 후 다음 슬라이드로 전환
	setTimeout(showSlides, 7000);
}

// 이미지 로드 오류 처리
slides.forEach(slide => {
	slide.onerror = function() {
		this.remove(); // 오류 발생 시 해당 이미지 요소를 제거
	};
});

// 콘텐츠 편집 가능 상태 변경 함수
function makeContentEditable(editable) {
	const editableElements = document.querySelectorAll('.editable');
	editableElements.forEach(el => el.contentEditable = editable);
}

// 이미지 로드 완료 후 슬라이드쇼 시작
Promise.all(Array.from(slides).map(img => {
	if (img.complete) return Promise.resolve();
	return new Promise(resolve => {
		img.onload = resolve;
		img.onerror = () => {
			img.remove();
			resolve();
		};
	});
})).then(() => {
	showSlides();
});
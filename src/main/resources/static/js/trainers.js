// 전역 변수 선언
const tabMapping = {
	career: 1,
	project: 2,
	education: 3
};
let scrollPosition = 0; // 현재 스크롤 위치 저장

$(function () {
	// 페이지 로드 후 fade-out 클래스 제거
	$('body').removeClass('fade-out');

	// a 태그 클릭 시 페이드 아웃 및 페이지 이동
	$(document).on('click', 'a', function (e) {
		const url = $(this).attr('href');
		if (!url || url.startsWith('#')) return; // 해시 링크 등은 무시
		e.preventDefault();
		$('body').addClass('fade-out');
		setTimeout(() => { window.location.href = url; }, 700);
	});

	// 헤더/푸터 로드
	loadHeaderFooter();

	// 카드 클릭 시 모달 오픈 (이벤트 위임)
	$(document).on('click', '.trainer-card, .admin-card', function (e) {
		if ($(this).data('no-modal')) return false;
		openModal.call(this, e);
	});

	// 모달 닫기 (X 버튼, 배경 클릭, ESC)
	$(document).on('click', '.close', closeModal);
	$(document).on('click', '#imageModal', function (e) {
		if (e.target === this) closeModal();
	});
	$(document).on('keydown', function (e) {
		if ($('#imageModal').is(':visible') && e.key === 'Escape') closeModal();
	});

	// 사이드바 탭 클릭 (이벤트 위임)
	$(document).on('click', '.tab-item', function () {
		const tabName = $(this).data('tab');
		const tabIndex = tabMapping[tabName];
		$('.tab-item').removeClass('active');
		$(this).addClass('active');
		$('.modal-content-container > div').hide();
		$(`.modal-content-container > div[data-trainer="${tabIndex}"]`).show();
	});

	// 트레이너/관리자 카드 반복 이미지 자동 생성
	$('.trainer-card, .admin-card').each(function () {
		const card = $(this);
		const thumbnailImg = card.find('.trainer-image, .admin-image').attr('src');
		const match = thumbnailImg && thumbnailImg.match(/member\/([^\/]+)/);
		const folder = match ? match[1] : null;

		// 프로필 이미지 생성 (존재하는 파일만 추가)
		const profileImagesContainer = card.find('.trainer-profile-images');
		if (profileImagesContainer.length && folder) {
			profileImagesContainer.empty();
			loadImages(profileImagesContainer, `images/member/${folder}/profile`, 10, '프로필 이미지', 'trainer-profile-image');
		}

		// 후기 이미지 생성
		const reviewImagesContainer = card.find('.trainer-review-images');
		if (reviewImagesContainer.length && folder) {
			reviewImagesContainer.empty();
			loadImages(reviewImagesContainer, `images/member/${folder}/review`, 30, '후기 이미지', 'trainer-review-image');
		}
	});
});

// 헤더/푸터 로드 함수
function loadHeaderFooter() {
	$('#header').load('header.html', function (response, status) {
		if (status === 'error') {
			$('#header').html('<p>기본 헤더</p>');
		} else {
			let prevScrollTop = 0;
			const header = $('#header');
			$(window).on('scroll', function () {
				let nextScrollTop = window.pageYOffset || 0;
				if (nextScrollTop > prevScrollTop) header.addClass('scrollDown');
				else header.removeClass('scrollDown');
				prevScrollTop = nextScrollTop;
			});
			if (typeof initializeHeader === 'function') initializeHeader();
		}
	});
	$('#footer').load('footer.html');
}

// 이미지 동적 로딩 함수 (존재하는 파일만 추가)
function loadImages(container, basePath, maxCount, altPrefix, className) {
	let loaded = 0;
	for (let i = 1; i <= maxCount; i++) {
		const imgSrc = `${basePath}${i}.jpg`;
		$('<img>')
			.attr({ src: imgSrc, alt: `${altPrefix} ${i}` })
			.addClass(className)
			.on('load', function () {
				container.append(this);
				loaded++;
			})
			.on('error', function () {

			});
	}
}

// 모달 열기 함수
function openModal(e) {
	e.preventDefault();
	e.stopPropagation();

	const trainerCard = $(this);
	const modal = $('#imageModal');

	// 스크롤 위치 저장 및 body 고정
	scrollPosition = window.scrollY;
	$('body').css({
		position: 'fixed',
		top: `-${scrollPosition}px`,
		width: '100%',
		height: '100%'
	}).addClass('modal-open');

	// 모달 활성화
	modal.css('display', 'flex');
	setTimeout(() => { modal.addClass('show'); }, 10);

	// 프로필 이미지 가져오기
	const profileImages = trainerCard.find('.trainer-profile-image').map(function () {
		return $(this).attr('src');
	}).get().filter(Boolean);

	// 경력 이미지
	const careerImage = trainerCard.find('.trainer-career-image').attr('src') || '';

	// 후기 이미지
	const reviewImages = trainerCard.find('.trainer-review-image').map(function () {
		return $(this).attr('src');
	}).get().filter(Boolean);

	// Instagram 링크
	const instagramLink = trainerCard.data('instagram') || '';

	// 썸네일 세팅
	const thumbnailsContainer = $('.thumbnails').empty();
	profileImages.forEach((image, idx) => {
		thumbnailsContainer.append(
			$('<img>').attr({
				src: image,
				alt: `프로필 이미지 ${idx + 1}`
			}).addClass('thumbnail-image')
		);
	});

	// 풀사이즈 이미지 세팅
	if (profileImages.length > 0) {
		$('#fullImage').attr('src', profileImages[0]).show();
	} else {
		$('#fullImage').hide();
	}

	// 썸네일 호버 시 풀 이미지 변경
	thumbnailsContainer.on('mouseover', '.thumbnail-image', function () {
		$('#fullImage').attr('src', $(this).attr('src')).show();
	});

	// 경력 이미지
	if (careerImage) $('#careerImage').attr('src', careerImage).show();
	else $('#careerImage').hide();

	// 후기 이미지 세팅
	const reviewContainer = $('.review-images').empty();
	if (reviewImages.length > 0) {
		reviewImages.forEach((image, idx) => {
			reviewContainer.append(
				$('<img>').attr({
					src: image,
					alt: `후기 이미지 ${idx + 1}`
				})
			);
		});
		reviewContainer.show();
	} else {
		reviewContainer.hide();
	}

	// Instagram 링크
	$('#instagramLink').attr('href', instagramLink);

	// 첫 번째 탭 활성화
	activateTab(1);

	// 포커스 이동 (접근성)
	setTimeout(() => { modal.attr('tabindex', -1).focus(); }, 100);
}

// 탭 활성화 함수
function activateTab(tabIndex) {
	$('.trainer-item').removeClass('active');
	$(`.trainer-item[data-trainer="${tabIndex}"]`).addClass('active');
	$('.modal-content-container > div').hide();
	$(`.modal-content-container > div[data-trainer="${tabIndex}"]`).show();
	updateSidebarState(tabIndex);
	$('.modal-content-container').scrollTop(0);
}

// 사이드바 탭 활성화 함수
function updateSidebarState(tabIndex) {
	const activeTabName = Object.keys(tabMapping).find(key => tabMapping[key] === tabIndex);
	$('.sidebar .tab-item').removeClass('active');
	$(`.sidebar .tab-item[data-tab="${activeTabName}"]`).addClass('active');
}

// 모달 닫기 함수
function closeModal() {
	const modal = $('#imageModal');
	modal.removeClass('show');
	setTimeout(() => { modal.css('display', 'none'); }, 500);

	// body 스타일 및 스크롤 위치 복원
	$('body').css({ position: '', top: '', width: '', height: '' }).removeClass('modal-open');
	window.scrollTo(0, scrollPosition);

	// 초기화
	$('.thumbnails, .review-images').empty();
	$('#fullImage, #careerImage').attr('src', '');
	$('#instagramLink').attr('href', '#');
	activateTab(1);
}

// 배경 클릭으로 모달 닫기 함수
function closeModalBackground(e) {
	if ($(e.target).is('#imageModal')) {
		closeModal();
	}
}
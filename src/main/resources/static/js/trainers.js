
// 전역 변수 선언
const tabMapping = {
	career: 1,
	project: 2,
	education: 3
};

let scrollPosition = 0; // 현재 스크롤 위치를 저장할 변수

$(document).ready(function () {

	// 페이지 로드 후 fade-out 클래스 제거
	document.body.classList.remove('fade-out');

	// 링크 클릭 시 페이드 아웃 효과 적용 (페이지 전환)
	document.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', event => {
			event.preventDefault();
			const url = link.getAttribute('href');
			document.body.classList.add('fade-out');
			setTimeout(() => {
				window.location.href = url;
			}, 700);
		});
	});

	// 1. 헤더와 푸터 로드
	loadHeaderFooter();

	// 2. 카드 클릭 시 모달 창 열기
	$('.trainer-card, .admin-card').on('click', function (e) {
		e.preventDefault(); // 기본 동작 방지
		e.stopPropagation(); // 이벤트 전파 방지

		// data-no-modal 속성이 있는 경우 모달 열림 방지
		if ($(this).data('no-modal')) {
			console.log('모달이 열리지 않습니다.'); // 디버깅 메시지 출력
			return false; // 함수 종료
		}

		// data-no-modal 속성이 없는 경우에만 openModal 함수 호출
		openModal.call(this, e);
	});

	// 3. 모달 창 닫기
	$('.close').on('click', closeModal);
	$('#imageModal').on('click', closeModalBackground);

	// 4. 탭 전환 이벤트
	$('.trainer-item').on('click', function () {
		const tabIndex = $(this).data('trainer');
		activateTab(tabIndex);
	});

	// 사이드바 탭 클릭 (이벤트 위임 방식)
	$(document).on('click', '.tab-item', function () {
		const tabName = $(this).data('tab'); // 클릭한 탭의 이름 가져오기
		const tabIndex = tabMapping[tabName]; // 매핑된 숫자 가져오기

		// 모든 탭에서 active 클래스 제거
		$('.tab-item').removeClass('active');

		// 클릭한 탭에 active 클래스 추가
		$(this).addClass('active');

		// 모든 콘텐츠 숨기기
		$('.modal-content-container > div').hide();

		// 클릭한 탭에 해당하는 콘텐츠 표시
		$(`.modal-content-container > div[data-trainer="${tabIndex}"]`).show();
	});

	// 트레이너 카드 반복 이미지 자동 생성
	$('.trainer-card, .admin-card').each(function () {
		const card = $(this);
		const thumbnailImg = card.find('.trainer-image, .admin-image').attr('src');
		const match = thumbnailImg.match(/member\/([^\/]+)/);
		const folder = match ? match[1] : null;

		// 프로필 이미지 생성
		const profileImagesContainer = card.find('.trainer-profile-images');
		if (profileImagesContainer.length && folder) {
			profileImagesContainer.empty();
			// 충분히 큰 최대치로 반복
			for (let i = 1; i <= 10; i++) {
				const imgSrc = `images/member/${folder}/profile${i}.jpg`;
				const img = new Image();
				img.onload = function () {
					profileImagesContainer.append(
						`<img src="${imgSrc}" alt="프로필 이미지 ${i}" class="trainer-profile-image">`
					);
				};
				img.onerror = function () {
					// 이미지가 없으면 아무것도 하지 않음
				};
				img.src = imgSrc;
			}
		}

		// 후기 이미지 생성
		const reviewImagesContainer = card.find('.trainer-review-images');
		if (reviewImagesContainer.length && folder) {
			reviewImagesContainer.empty();
			// 충분히 큰 최대치로 반복 (예: 12장까지 시도)
			for (let i = 1; i <= 30; i++) {
				const imgSrc = `images/member/${folder}/review${i}.jpg`;
				const img = new Image();
				img.onload = function () {
					reviewImagesContainer.append(
						`<img src="${imgSrc}" alt="후기 이미지 ${i}" class="trainer-review-image">`
					);
				};
				img.onerror = function () {
					// 이미지가 없으면 아무것도 하지 않음
				};
				img.src = imgSrc;
			}
		}
	});

});

// 헤더와 푸터 로드 함수
function loadHeaderFooter() {
	$('#header').load('header.html', function (response, status) {
		if (status === 'error') {
			console.error('헤더 로드 실패');
			$('#header').html('<p>기본 헤더</p>');
		} else {
			let prevScrollTop = 0;
			const header = document.getElementById('header');

			window.addEventListener('scroll', function () {
				let nextScrollTop = window.pageYOffset || 0;
				if (nextScrollTop > prevScrollTop) {
					// 스크롤 내릴 때
					header.classList.add('scrollDown');
				} else {
					// 스크롤 올릴 때
					header.classList.remove('scrollDown');
				}
				prevScrollTop = nextScrollTop;
			});

			if (typeof initializeHeader === 'function') {
				initializeHeader();
			}
		}
	});
	$('#footer').load('footer.html');
}

// 모달 열기 함수
function openModal(e) {
	e.preventDefault();
	e.stopPropagation();

	const trainerCard = $(this); // 클릭한 트레이너 카드
	const modal = $('#imageModal'); // 모달 요소 가져오기

	// 현재 스크롤 위치 저장
	scrollPosition = window.scrollY;

	// body를 고정하고 현재 스크롤 위치만큼 위로 이동시켜서 화면이 움직이지 않도록 함
	$('body').css({
		position: 'fixed',
		top: `-${scrollPosition}px`,
		width: '100%',
		height: '100%'
	}).addClass('modal-open');

	//모달 활성화
	modal.css('display', 'flex'); // 먼저 보여지도록 설정
	setTimeout(() => {
		modal.addClass('show'); // 페이드인 효과 활성화
	}, 10); // 약간의 지연으로 transition 효과를 적용

	// 프로필 이미지 가져오기
	const profileImages = trainerCard.find('.trainer-profile-image').map(function () {
		return $(this).attr('src');
	}).get().filter(src => src && src.trim() !== '');


	// 경력 이미지 가져오기
	const careerImage = trainerCard.find('.trainer-career-image').attr('src') || '';

	// 후기 이미지 가져오기
	const reviewImages = trainerCard.find('.trainer-review-image').map(function () {
		return $(this).attr('src'); // src 속성만 가져옴
	}).get().filter(src => src && src.trim() !== ''); // 유효한 src만 필터링





	// Instagram 링크 가져오기
	const instagramLink = trainerCard.data('instagram') || '';

	// 프로필 썸네일 추가
	const thumbnailsContainer = $('.thumbnails');
	thumbnailsContainer.empty(); // 기존 썸네일 초기화
	profileImages.forEach((image, index) => {
		if (image && image.trim() !== '') { // 이미지가 있는 경우에만 추가
			thumbnailsContainer.append(`<img src="${image}" alt="프로필 이미지 ${index + 1}" class="thumbnail-image">`);
		}
	});

	// 첫 번째 이미지를 풀사이즈로 설정
	if (profileImages.length > 0) {
		$('#fullImage').attr('src', profileImages[0]).show();
	} else {
		$('#fullImage').hide(); // 이미지가 없으면 숨김
	}

	// 썸네일 호버 시 풀 이미지 변경 이벤트 추가
	document.querySelectorAll('.thumbnail-image').forEach(thumbnail => {
		thumbnail.addEventListener('mouseover', function () {
			document.getElementById('fullImage').src = this.src; // 호버한 썸네일의 src를 풀 이미지로 설정
			document.getElementById('fullImage').style.display = 'block'; // 풀 이미지를 보이도록 설정
		});
	});

	// 경력 이미지 설정
	if (careerImage && careerImage.trim() !== '') {
		$('#careerImage').attr('src', careerImage).show();
	} else {
		$('#careerImage').hide(); // 경력 이미지가 없으면 숨김
	}

	// 후기 이미지 추가
	const reviewContainer = $('.review-images');
	reviewContainer.empty();
	const filteredReviewImages = reviewImages.filter(src => src && src.trim() !== '');
	if (filteredReviewImages.length > 0) {
		filteredReviewImages.forEach((image, index) => {
			reviewContainer.append(`<img src="${image}" alt="후기 이미지 ${index + 1}">`);
			reviewContainer.show(); // 후기 이미지를 표시함
		});
	} else {
		reviewContainer.hide(); // 후기 이미지가 없을 경우 컨테이너를 숨김
	}

	// Instagram 링크 설정
	$('#instagramLink').attr('href', instagramLink);

	activateTab(1); // 첫 번째 탭 활성화
}

// 탭 활성화 함수
function activateTab(tabIndex) {
	$('.trainer-item').removeClass('active');
	$(`.trainer-item[data-trainer="${tabIndex}"]`).addClass('active');

	$('.modal-content-container > div').hide();
	$(`.modal-content-container > div[data-trainer="${tabIndex}"]`).show();

	updateSidebarState(tabIndex);

	// 스크롤 위치 초기화
	$('.modal-content-container').scrollTop(0);
}

// 사이드바 탭 활성화 함수
function activateSidebarTab(tabName) {
	$('.sidebar-tab').removeClass('active');
	$(`.sidebar-tab[data-tab="${tabName}"]`).addClass('active');

	$('.tab-content').hide();
	$(`.tab-content[data-tab="${tabName}"]`).show();
}

// 모달 닫기 함수
function closeModal() {
	const modal = $('#imageModal'); // 모달 요소 가져오기

	modal.removeClass('show'); // 모달 숨기기

	setTimeout(() => {
		modal.css('display', 'none'); // 페이드아웃 후 display를 none으로 설정
	}, 500); // transition 시간과 동일하게 설정

	// body 스타일 초기화 및 스크롤 위치 복원
	$('body').css({
		position: '',
		top: '',
		width: '',
		height: ''
	}).removeClass('modal-open');

	window.scrollTo(0, scrollPosition); // 저장된 스크롤 위치로 이동

	// 초기화 작업
	$('.thumbnails, .review-images').empty(); // 썸네일 및 후기 이미지 비우기
	$('#fullImage, #careerImage').attr('src', ''); // 풀사이즈 및 경력 이미지 초기화
	$('#instagramLink').attr('href', '#'); // Instagram 링크 초기화

	activateTab(1); // 첫 번째 탭으로 초기화
}

// 배경 클릭으로 모달 닫기 함수
function closeModalBackground(e) {
	if ($(e.target).is('#imageModal')) {
		closeModal();
	}
}

// 사이드바 상태 업데이트 함수
function updateSidebarState(tabIndex) {
	const tabMapping = {
		1: 'career',
		2: 'project',
		3: 'education'
	};
	const activeTabName = tabMapping[tabIndex];

	$('.sidebar .tab-item').removeClass('active');
	$(`.sidebar .tab-item[data-tab="${activeTabName}"]`).addClass('active');
}
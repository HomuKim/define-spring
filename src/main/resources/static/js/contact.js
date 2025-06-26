let map;

// 지도 모달 열기 및 초기화 함수
function openMap() {
	// 모달 표시 및 애니메이션 적용
	var modal = document.getElementById("mapModal");
	modal.style.display = "block";
	setTimeout(() => {
		modal.classList.add('show');
	}, 10);

	// 지도 초기화 (처음 한 번만)
	if (!map) {
		var lat = 37.6086138;
		var lng = 127.0151611;

		var mapOptions = {
			center: new naver.maps.LatLng(lat, lng),
			zoom: 15
		};

		map = new naver.maps.Map('naverMap', mapOptions);

		var marker = new naver.maps.Marker({
			position: new naver.maps.LatLng(lat, lng),
			map: map
		});

		// 마커 클릭 시 네이버 지도로 이동
		naver.maps.Event.addListener(marker, 'click', function () {
			window.open("https://map.naver.com/v5/search/디파인더바디짐/place/" + lat + "," + lng);
		});
	}
}

// 지도 모달 닫기 함수
function closeMapModal() {
	var modal = document.getElementById("mapModal");
	modal.classList.add('hide');
	modal.classList.remove('show');
	setTimeout(() => {
		modal.style.display = "none";
		modal.classList.remove('hide');
	}, 300);
}

// 이미지 모달 열기 함수
function openImageModal(imageSrc) {
	var modal = document.getElementById("imageModal");
	var modalImg = document.getElementById("modalImage");
	modalImg.src = imageSrc;

	modal.style.display = "block";
	setTimeout(() => {
		modal.classList.add('show');
	}, 10);
}

// 페이지 로드 완료 시 실행되는 함수
document.addEventListener('DOMContentLoaded', function () {
	var modal = document.getElementById("videoModal");
	var player = document.getElementById("youtubePlayer");
	var closeBtn = modal.querySelector('.close-btn');

	// 비디오 모달 열기 함수
	function openVideoModal(videoId) {
		var modal = document.getElementById("videoModal");
		var player = document.getElementById("youtubePlayer");
		player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
		modal.classList.add('show');
	}

	// 비디오 모달 닫기 함수
	function closeVideoModal() {
		var modal = document.getElementById("videoModal");
		var player = document.getElementById("youtubePlayer");
		modal.classList.remove('show');
		player.src = "";  // 동영상 정지
	}

	// 클로즈 버튼 클릭 시 모달 닫기
	if (closeBtn) {
		closeBtn.onclick = closeVideoModal;
	}

	// 모달 외부 클릭 시 닫기
	window.onclick = function (event) {
		if (event.target == modal) {
			closeVideoModal();
		}
	}

	// openVideoModal 함수를 전역 스코프에 노출
	window.openVideoModal = openVideoModal;
});

// 이미지 모달 닫기 함수
function closeImageModal() {
	var modal = document.getElementById("imageModal");
	modal.classList.add('hide');
	modal.classList.remove('show');
	setTimeout(() => {
		modal.style.display = "none";
		modal.classList.remove('hide');
	}, 300);
}

// jQuery를 사용한 페이지 초기화
$(document).ready(function () {

	// 페이지 로드 후 fade-out 클래스 제거
	document.body.classList.remove('fade-out');

	// 링크 클릭 시 페이드 아웃 효과 적용
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

	// 네이버맵 모달 관련
	$('#mapModal .close').on('click', closeMapModal);

	// 이미지 모달 관련
	$('#imageModal .close').on('click', closeImageModal);

	// 모달 외부 클릭 시 닫기
	$(window).on('click', function (event) {
		var mapModal = document.getElementById("mapModal");
		var imageModal = document.getElementById("imageModal");

		if (event.target == mapModal) {
			closeMapModal();
		}
		if (event.target == imageModal) {
			closeImageModal();
		}
	});

	// 채팅 문의 클릭 이벤트
	$('.contact-item:first-child').on('click', function () {
		window.open('https://talk.naver.com/ct/w5u13y?frm=pnmb&frm=nmb_detail#nafullscreen');
	});

	// 헤더/푸터 동적 로드
	$("#header").load("header.html", function () {
		// 헤더 로드 완료 후 실행될 코드
		if (typeof initializeHeader === 'function') {
			initializeHeader();
		}
	});
	$("#footer").load("footer.html");

});
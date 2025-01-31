document.addEventListener('DOMContentLoaded', function() {
	let currentIndex = 0;
	const images = document.querySelectorAll('.thumbnail');
	const mainImage = document.getElementById('mainImage');
	let isAnimating = false;
	let isEditMode = false;

	function addTimestamp(url) {
		return url.split('?')[0] + '?t=' + new Date().getTime();
	}

	// 모든 이미지에 타임스탬프 추가
	images.forEach(img => {
		img.src = addTimestamp(img.src);
	});

	function showImage(index) {
		if (isAnimating) return;
		isAnimating = true;

		mainImage.classList.add('fade-out');

		setTimeout(() => {
			mainImage.src = addTimestamp(images[index].src);
			mainImage.alt = images[index].alt;
			mainImage.dataset.id = images[index].dataset.id;
			mainImage.classList.remove('fade-out');
			mainImage.classList.add('fade-in');

			images.forEach((thumb, i) => {
				thumb.classList.toggle('active', i === index);
			});

			setTimeout(() => {
				isAnimating = false;
				mainImage.classList.remove('fade-in');
			}, 500);
		}, 500);
	}

	function changeSlide(direction) {
		if (isAnimating || isEditMode) return;

		const currentMainSrc = mainImage.src.split('?')[0];
		let currentMainIndex = Array.from(images).findIndex(img => img.src.split('?')[0] === currentMainSrc);

		if (currentMainIndex === -1) currentMainIndex = currentIndex;

		let nextIndex = currentMainIndex + direction;

		if (nextIndex >= images.length) nextIndex = 0;
		if (nextIndex < 0) nextIndex = images.length - 1;

		currentIndex = nextIndex;
		showImage(nextIndex);
	}

	// 썸네일 클릭 이벤트
	images.forEach((thumbnail, index) => {
		thumbnail.addEventListener('click', () => {
			if (!isEditMode) {
				showImage(index);
			} else {
				const fileInput = thumbnail.closest('.thumbnail-wrapper').querySelector('.image-upload');
				fileInput.click();
			}
		});
	});


	// 이전/다음 버튼 이벤트
	document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
	document.querySelector('.next').addEventListener('click', () => changeSlide(1));

	// 관리자 기능 관련 코드
	function checkAdminStatus() {
		if (sessionStorage.getItem('adminLoggedIn') === 'true') {
			document.getElementById('editButton').style.display = 'block';
		}
	}

	checkAdminStatus();

	// 수정 모드 버튼 이벤트
	document.getElementById('editButton').addEventListener('click', function() {
		isEditMode = !isEditMode;
		this.textContent = isEditMode ? '보기 모드' : '수정 모드';
		document.body.classList.toggle('edit-mode', isEditMode);

		// 파일 입력 필드의 pointer-events 속성 조절
		document.querySelectorAll('.image-upload').forEach(input => {
			input.style.pointerEvents = isEditMode ? 'auto' : 'none';
		});
	});

	// 파일 선택 시 이벤트
	document.querySelectorAll('.image-upload').forEach(input => {
		input.addEventListener('change', function(e) {
			const file = e.target.files[0];
			const thumbnail = this.previousElementSibling;

			if (file) {
				const formData = new FormData();
				formData.append('image', file);
				const facilityId = thumbnail.dataset.id;
				if (!facilityId) {
					alert('시설 ID를 찾을 수 없습니다.');
					return;
				}
				formData.append('facilityId', facilityId);

				fetch('/facilities/update-image', {
					method: 'POST',
					body: formData
				})
					.then(response => response.json())
					.then(data => {
						if (data.success) {
							thumbnail.src = addTimestamp(data.newImageUrl);
							if (mainImage.dataset.id === thumbnail.dataset.id) {
								mainImage.src = addTimestamp(data.newImageUrl);
							}
							alert('이미지가 성공적으로 업데이트되었습니다.');
						} else {
							alert('이미지 업데이트에 실패했습니다: ' + data.message);
						}
					})
					.catch(error => {
						console.error('Error:', error);
						alert('이미지 업로드 중 오류가 발생했습니다.');
					});
			}
		});
	});

	// 초기 이미지 표시
	showImage(0);
});

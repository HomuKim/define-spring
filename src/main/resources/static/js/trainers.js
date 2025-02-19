document.addEventListener('DOMContentLoaded', function() {
	var modal = document.getElementById("imageModal");
	var modalImg = document.getElementById("modalImage");
	var instagramLink = document.getElementById("instagramLink");
	var closeBtn = document.querySelector('.trainer-modal-close');
	var trainerCards = document.querySelectorAll('.trainer-card');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');
	const modalContentContainer = document.querySelector('.trainer-modal-content-container');
	let currentTrainerIndex = 0;
	let isEditMode = false; // 전역 스코프로 이동

	// 모달 관련 함수들
	function resetModal() {
		modal.style.display = "none";
		modal.classList.remove('active');
		modalImg.src = '';
		instagramLink.href = '';
	}

	function openModal(card) {
		var fullImage = card.querySelector('.trainer-full-image');
		if (fullImage) {
			showModal(fullImage);
		}
	}

	function showModal(fullImage) {
		modal.style.display = "flex";
		modal.classList.add('active');
		modalImg.src = fullImage.src;
		instagramLink.href = fullImage.parentNode.dataset.instagram;

		modalImg.style.opacity = 0;
		instagramLink.style.opacity = 0;
		if (prevBtn) prevBtn.style.opacity = 0;
		if (nextBtn) nextBtn.style.opacity = 0;

		setTimeout(() => {
			modalImg.style.opacity = 1;
			instagramLink.style.opacity = 1;
			if (prevBtn) prevBtn.style.opacity = 1;
			if (nextBtn) nextBtn.style.opacity = 1;
		}, 50);

		document.body.style.overflow = 'hidden';
	}

	function updateModalContent(card) {
		modalImg.style.opacity = 0;
		instagramLink.style.opacity = 0;

		setTimeout(() => {
			var fullImage = card.querySelector('.trainer-full-image');
			if (fullImage) {
				modalImg.src = fullImage.src;
				instagramLink.href = card.dataset.instagram;

				modalImg.onload = function() {
					modalImg.style.opacity = 1;
					instagramLink.style.opacity = 1;
				};
			}
		}, 300);
	}

	function closeModal() {
		modalImg.style.opacity = 0;
		instagramLink.style.opacity = 0;
		if (prevBtn) prevBtn.style.opacity = 0;
		if (nextBtn) nextBtn.style.opacity = 0;
		modal.classList.remove('active');
		setTimeout(() => {
			modal.style.display = "none";
			document.body.style.overflow = '';
		}, 500);
	}

	// 이벤트 리스너 설정
	if (closeBtn) {
		closeBtn.onclick = closeModal;
	}

	modal.addEventListener('click', function(event) {
		if (event.target === modal) {
			closeModal();
		}
	});

	// 트레이너 카드 클릭 이벤트
	trainerCards.forEach(function(card, index) {
		card.onclick = function(e) {
			if (isEditMode) {
				// 수정 모드일 때 파일 입력 클릭
				const fileInput = this.querySelector('.image-upload');
				if (fileInput) {
					fileInput.click();
				}
				e.preventDefault();
			} else {
				// 보기 모드일 때 모달 열기
				currentTrainerIndex = index;
				openModal(this);
			}
		}
	});

	// 이전/다음 슬라이드 함수
	function prevSlide() {
		do {
			currentTrainerIndex = (currentTrainerIndex - 1 + trainerCards.length) % trainerCards.length;
		} while (trainerCards[currentTrainerIndex].style.display === 'none');
		updateModalContent(trainerCards[currentTrainerIndex]);
	}

	function nextSlide() {
		do {
			currentTrainerIndex = (currentTrainerIndex + 1) % trainerCards.length;
		} while (trainerCards[currentTrainerIndex].style.display === 'none');
		updateModalContent(trainerCards[currentTrainerIndex]);
	}

	// 이전/다음 버튼 이벤트
	if (prevBtn && nextBtn) {
		prevBtn.onclick = function(e) {
			e.stopPropagation();
			prevSlide();
		}

		nextBtn.onclick = function(e) {
			e.stopPropagation();
			nextSlide();
		}
	}

	// 터치 스와이프 기능
	if (modalContentContainer) {
		let startX, moveX;

		modalContentContainer.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			modalContentContainer.classList.add('swiping');
			instagramLink.style.opacity = '0';
		});

		modalContentContainer.addEventListener('touchmove', (e) => {
			moveX = e.touches[0].clientX;
			const diff = moveX - startX;
			modalContentContainer.style.transform = `translateX(${diff}px)`;
		});

		modalContentContainer.addEventListener('touchend', (e) => {
			modalContentContainer.classList.remove('swiping');
			const diff = moveX - startX;
			if (Math.abs(diff) > 100) {
				if (diff > 0) {
					prevSlide();
				} else {
					nextSlide();
				}
			} else {
				instagramLink.style.opacity = '1';
			}
			modalContentContainer.style.transform = '';
		});
	}

	// 관리자 기능
	const editButton = document.getElementById('editButton');

	if (window.isAdmin) {
		editButton.style.display = 'block';
	}

	editButton.addEventListener('click', function() {
		isEditMode = !isEditMode;
		this.textContent = isEditMode ? '보기 모드' : '수정 모드';
		document.body.classList.toggle('edit-mode', isEditMode);
		console.log('Edit mode:', isEditMode); // 디버깅용
	});

	// 이미지 업로드 처리
	document.querySelectorAll('.trainer-card').forEach(card => {
		const fileInput = card.querySelector('.image-upload');
		const thumbnailImage = card.querySelector('.trainer-image');
		const fullImage = card.querySelector('.trainer-full-image');

		fileInput.addEventListener('change', function(e) {
			const file = e.target.files[0];
			if (file) {
				const formData = new FormData();
				formData.append('fullImage', file);
				formData.append('thumbnailImage', file);
				formData.append('trainerId', card.dataset.id);

				fetch('/trainers/update-image', {
					method: 'POST',
					body: formData
				})
					.then(response => response.json())
					.then(data => {
						if (data.success) {
							thumbnailImage.src = data.newThumbnailImageUrl;
							fullImage.src = data.newFullImageUrl;
							alert('이미지가 성공적으로 업데이트되었습니다.');
						} else {
							throw new Error(data.message || '이미지 업데이트 실패');
						}
					})
					.catch(error => {
						console.error('Error:', error);
						alert('이미지 업로드 중 오류가 발생했습니다: ' + error.message);
					});
			}
		});
	});

	// 초기 모달 리셋
	resetModal();
});

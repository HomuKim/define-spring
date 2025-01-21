document.addEventListener('DOMContentLoaded', function() {
	var modal = document.getElementById("imageModal");
	var modalImg = document.getElementById("modalImage");
	var instagramLink = document.getElementById("instagramLink");
	var closeBtn = document.querySelector('.close');
	var trainerCards = document.querySelectorAll('.trainer-card');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');
	const modalContentContainer = document.querySelector('.modal-content-container');
	let currentTrainerIndex = 0;

	if (modal && modalImg && instagramLink) {
		function resetModal() {
			modal.style.display = "none";
			modal.classList.remove('active');
			modalImg.src = '';
			instagramLink.href = '';
		}

		resetModal();

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

		if (closeBtn) {
			closeBtn.onclick = closeModal;
		} else {
			console.warn("닫기 버튼을 찾을 수 없습니다. 모달 닫기를 위한 클릭 이벤트를 추가합니다.");
		}

		modal.addEventListener('click', function(event) {
			if (event.target === modal) {
				closeModal();
			}
		});
	} else {
		console.error("필수 모달 요소 중 하나 이상이 누락되었습니다");
	}

	if (trainerCards.length > 0) {
		trainerCards.forEach(function(card, index) {
			card.onclick = function() {
				currentTrainerIndex = index;
				openModal(this);
			}
		});

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

		if (prevBtn && nextBtn) {
			prevBtn.onclick = function(e) {
				e.stopPropagation();
				prevSlide();
			}

			nextBtn.onclick = function(e) {
				e.stopPropagation();
				nextSlide();
			}
		} else {
			console.warn("이전/다음 버튼을 찾을 수 없습니다.");
		}
	} else {
		console.warn("트레이너 카드를 찾을 수 없습니다.");
	}

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
	} else {
		console.warn("모달 콘텐츠 컨테이너를 찾을 수 없습니다. 터치 이벤트가 추가되지 않았습니다.");
	}
});

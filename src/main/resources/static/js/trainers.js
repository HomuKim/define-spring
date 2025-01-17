window.addEventListener('load', function() {
	var modal = document.getElementById("imageModal");
	var modalImg = document.getElementById("modalImage");
	var instagramLink = document.getElementById("instagramLink");
	var closeBtn = document.getElementsByClassName("close")[0];
	var trainerCards = document.querySelectorAll('.trainer-card');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');
	let currentTrainerIndex = 0;

	function resetModal() {
		modal.style.display = "none";
		modal.classList.remove('active');
		modalImg.src = '';
		instagramLink.href = '';
	}

	resetModal();

	trainerCards.forEach(function(card, index) {
		card.onclick = function() {
			currentTrainerIndex = index;
			openModal(this);
		}
	});

	function openModal(card) {
		var fullImage = card.querySelector('.trainer-full-image');
		showModal(fullImage);
	}

	function showModal(fullImage) {
		modal.style.display = "flex";
		modal.classList.add('active');
		modalImg.src = fullImage.src;
		instagramLink.href = fullImage.parentNode.dataset.instagram;

		modalImg.style.opacity = 0;
		instagramLink.style.opacity = 0;
		prevBtn.style.opacity = 0;
		nextBtn.style.opacity = 0;

		setTimeout(() => {
			modalImg.style.opacity = 1;
			instagramLink.style.opacity = 1;
			prevBtn.style.opacity = 1;
			nextBtn.style.opacity = 1;
		}, 50);

		document.body.style.overflow = 'hidden';
	}

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

	prevBtn.onclick = function(e) {
		e.stopPropagation();
		prevSlide();
	}

	nextBtn.onclick = function(e) {
		e.stopPropagation();
		nextSlide();
	}

	function updateModalContent(card) {
		modalImg.style.opacity = 0;
		instagramLink.style.opacity = 0;

		setTimeout(() => {
			var fullImage = card.querySelector('.trainer-full-image');
			modalImg.src = fullImage.src;
			instagramLink.href = card.dataset.instagram;

			modalImg.onload = function() {
				modalImg.style.opacity = 1;
				instagramLink.style.opacity = 1;
			};
		}, 300);
	}

	closeBtn.onclick = closeModal;

	window.onclick = function(event) {
		if (event.target == modal) {
			closeModal();
		}
	}

	function closeModal() {
		modalImg.style.opacity = 0;
		instagramLink.style.opacity = 0;
		prevBtn.style.opacity = 0;
		nextBtn.style.opacity = 0;
		modal.classList.remove('active');
		setTimeout(() => {
			modal.style.display = "none";
			document.body.style.overflow = '';
		}, 500);
	}

	// 모바일 스와이프 기능
	let startX, moveX;
	const modalContentContainer = document.querySelector('.modal-content-container');

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
});
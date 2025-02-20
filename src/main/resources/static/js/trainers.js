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
	let isEditMode = false;

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

	if (closeBtn) {
		closeBtn.onclick = closeModal;
	}

	modal.addEventListener('click', function(event) {
		if (event.target === modal) {
			closeModal();
		}
	});

	function handleImageUpload(trainerId, imageType) {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.onchange = function(e) {
			const file = e.target.files[0];
			if (file && file.type.startsWith('image/')) {
				const formData = new FormData();
				formData.append('fullImage', imageType === 'full' ? file : null);
				formData.append('thumbnailImage', imageType === 'thumbnail' ? file : null);
				formData.append('trainerId', trainerId);

				fetch('/trainers/update-image', {
					method: 'POST',
					body: formData
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('서버 응답 오류');
						}
						return response.json();
					})
					.then(data => {
						if (data.success) {
							updateImages(trainerId, data.newThumbnailImageUrl, data.newFullImageUrl);
							alert('이미지가 성공적으로 업데이트되었습니다.');
						} else {
							throw new Error(data.message || '이미지 업데이트 실패');
						}
					})
					.catch(error => {
						console.error('Error:', error);
						alert('이미지 업로드 중 오류가 발생했습니다: ' + error.message);
					});
			} else {
				alert('유효한 이미지 파일을 선택해주세요.');
			}
		};
		fileInput.click();
	}

	function updateImages(trainerId, thumbnailUrl, fullUrl) {
		const trainerCard = document.querySelector(`.trainer-card[data-id="${trainerId}"]`);
		if (trainerCard) {
			const thumbnailImage = trainerCard.querySelector('.trainer-image');
			const fullImage = trainerCard.querySelector('.trainer-full-image');
			if (thumbnailImage && thumbnailUrl) thumbnailImage.src = thumbnailUrl;
			if (fullImage && fullUrl) fullImage.src = fullUrl;
		}
	}

	function showEditModal(trainerId) {
		const editModal = document.createElement('div');
		editModal.className = 'edit-modal';

		editModal.innerHTML = `
            <div class="edit-modal-content">
                <h2>트레이너 정보 수정</h2>
                <button id="editFullImage">전체 이미지 변경</button>
                <button id="editThumbnailImage">썸네일 이미지 변경</button>
                <button id="editInstagram">인스타그램 주소 변경</button>
                <button id="closeEditModal">닫기</button>
            </div>
        `;

		document.body.appendChild(editModal);

		setTimeout(() => {
			editModal.classList.add('active');
		}, 10);

		function closeEditModal() {
			editModal.classList.remove('active');
			setTimeout(() => {
				document.body.removeChild(editModal);
			}, 300);
		}

		document.getElementById('editFullImage').addEventListener('click', () => handleImageUpload(trainerId, 'full'));
		document.getElementById('editThumbnailImage').addEventListener('click', () => handleImageUpload(trainerId, 'thumbnail'));
		document.getElementById('editInstagram').addEventListener('click', () => editInstagramAddress(trainerId));
		document.getElementById('closeEditModal').addEventListener('click', closeEditModal);

		// ESC 키로 모달 닫기
		const escHandler = (e) => {
			if (e.key === 'Escape') {
				closeEditModal();
				document.removeEventListener('keydown', escHandler);
			}
		};
		document.addEventListener('keydown', escHandler);
	}

	function editInstagramAddress(trainerId) {
		console.log(`editInstagramAddress 함수 호출됨. trainerId: ${trainerId}`);

		const newAddress = prompt("새로운 인스타그램 주소를 입력하세요:");
		console.log(`사용자 입력 주소: ${newAddress}`);

		if (newAddress) {
			fetch(`/api/trainers/${trainerId}/instagram`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ instagramAddress: newAddress })
			})
				.then(response => response.json())
				.then(data => {
					console.log('서버 응답:', data);
					if (data.success) {
						alert("인스타그램 주소가 성공적으로 업데이트되었습니다.");
						// 필요한 경우 UI 업데이트
					} else {
						alert("인스타그램 주소 업데이트에 실패했습니다.");
					}
				})
				.catch(error => {
					console.error('Error:', error);
					alert("오류가 발생했습니다. 다시 시도해주세요.");
				});
		} else {
			console.log('사용자가 입력을 취소했거나 빈 문자열을 입력했습니다.');
		}
	}


	trainerCards.forEach(function(card) {
		const trainerId = card.dataset.id;
		card.addEventListener('click', function(e) {
			if (isEditMode) {
				e.preventDefault();
				showEditModal(trainerId);
			} else {
				currentTrainerIndex = Array.from(trainerCards).indexOf(card);
				openModal(card);
			}
		});
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
	}

	const editButton = document.getElementById('editButton');

	if (window.isAdmin) {
		editButton.style.display = 'block';
	}

	editButton.addEventListener('click', function() {
		isEditMode = !isEditMode;
		this.textContent = isEditMode ? '보기 모드' : '수정 모드';
		document.body.classList.toggle('edit-mode', isEditMode);
		console.log('Edit mode:', isEditMode);
	});

	resetModal();
});
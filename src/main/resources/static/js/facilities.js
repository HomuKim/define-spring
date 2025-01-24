// 관리자 로그인 상태 확인 및 수정 버튼 표시
function checkAdminStatus() {
	if (sessionStorage.getItem('adminLoggedIn') === 'true') {
		document.querySelector('.edit-button').style.display = 'block';
	}
}

document.addEventListener('DOMContentLoaded', function() {
	let currentIndex = 0;
	const images = document.querySelectorAll('.thumbnail');
	const mainImage = document.getElementById('mainImage');
	let isAnimating = false;

	function showImage(index) {
		if (isAnimating) return;
		isAnimating = true;

		mainImage.classList.add('fade-out');

		setTimeout(() => {
			mainImage.src = images[index].src;
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
		if (isAnimating) return;

		const currentMainSrc = mainImage.src;
		let currentMainIndex = Array.from(images).findIndex(img => img.src === currentMainSrc);

		if (currentMainIndex === -1) currentMainIndex = currentIndex;

		let nextIndex = currentMainIndex + direction;

		if (nextIndex >= images.length) nextIndex = 0;
		if (nextIndex < 0) nextIndex = images.length - 1;

		currentIndex = nextIndex;
		showImage(nextIndex);
	}

	// 썸네일 클릭 이벤트
	images.forEach((thumbnail, index) => {
		thumbnail.addEventListener('click', () => showImage(index));
	});

	// 이전/다음 버튼 이벤트
	document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
	document.querySelector('.next').addEventListener('click', () => changeSlide(1));

	// 관리자 기능 관련 코드
	checkAdminStatus();

	document.querySelector('.edit-button').addEventListener('click', function() {
		document.getElementById('editModal').style.display = 'block';
		document.getElementById('editName').value = document.querySelector('.facility-hero h1').textContent;
		document.getElementById('editDescription').value = document.querySelector('.facility-hero p').textContent;
		document.getElementById('editImageUrl').value = mainImage.src;
	});

	document.querySelector('.close').addEventListener('click', function() {
		document.getElementById('editModal').style.display = 'none';
	});

	document.getElementById('editForm').addEventListener('submit', function(e) {
		e.preventDefault();
		const newName = document.getElementById('editName').value;
		const newDescription = document.getElementById('editDescription').value;
		const newImageUrl = document.getElementById('editImageUrl').value;

		fetch('/api/update-facility', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 필요한 경우 인증 토큰 추가
				// 'Authorization': 'Bearer ' + sessionStorage.getItem('adminToken')
			},
			body: JSON.stringify({
				name: newName,
				description: newDescription,
				imageUrl: newImageUrl
			})
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				if (data.success) {
					// UI 업데이트
					document.querySelector('.facility-hero h1').textContent = newName;
					document.querySelector('.facility-hero p').textContent = newDescription;
					mainImage.src = newImageUrl;
					document.getElementById('editModal').style.display = 'none';
					alert('시설 정보가 성공적으로 업데이트되었습니다.');
				} else {
					alert('시설 정보 업데이트에 실패했습니다: ' + data.message);
				}
			})
			.catch(error => {
				console.error('Error:', error);
				alert('시설 정보 업데이트 중 오류가 발생했습니다.');
			});
	});

	// 초기 이미지 표시
	showImage(0);
});

window.addEventListener('load', function() {
	if (sessionStorage.getItem('adminLoggedIn') === 'true') {
		document.body.classList.add('admin-logged-in');
	}
});
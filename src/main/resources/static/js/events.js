document.addEventListener('DOMContentLoaded', function() {
	const eventImage = document.getElementById('eventImage');
	const eventTitle = document.getElementById('eventTitle');
	const eventDescription = document.getElementById('eventDescription');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');

	const events = window.serverEvents || [];

	if (events.length === 0) {
		console.log("이벤트가 없습니다.");
		return;
	}

	let currentIndex = 0;

	function updateEvent(index) {
		eventImage.classList.add('fade-out');
		eventTitle.classList.add('fade-out');
		eventDescription.classList.add('fade-out');

		setTimeout(() => {
			eventImage.src = events[index].image;
			eventTitle.textContent = events[index].title;
			eventDescription.innerHTML = events[index].description;

			eventImage.classList.remove('fade-out');
			eventTitle.classList.remove('fade-out');
			eventDescription.classList.remove('fade-out');
		}, 300);
	}

	function checkImageExists(url) {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => {
				console.error(`이미지 로드 실패: ${url}`);
				resolve(false);
			};
			img.src = url;
		});
	}

	async function changeEvent(direction) {
		let newIndex = (currentIndex + direction + events.length) % events.length;
		let imageExists = false;

		while (!imageExists) {
			imageExists = await checkImageExists(events[newIndex].image);
			if (imageExists) {
				currentIndex = newIndex;
				updateEvent(currentIndex);
				break;
			}

			newIndex = (newIndex + direction + events.length) % events.length;
			if (newIndex === currentIndex) {
				console.log("유효한 이미지를 찾을 수 없습니다");
				return;
			}
		}
	}

	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	const debouncedChangeEvent = debounce(changeEvent, 300);

	prevBtn.addEventListener('click', () => debouncedChangeEvent(-1));
	nextBtn.addEventListener('click', () => debouncedChangeEvent(1));

	updateEvent(currentIndex);
	updateButtonState();
});

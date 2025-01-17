document.addEventListener('DOMContentLoaded', function() {
	const mainImage = document.getElementById('mainImage');
	const introTitle = document.getElementById('introTitle');
	const introText = document.getElementById('introText');
	const buttons = document.querySelectorAll('.intro-button');
	const introContent = document.querySelector('.intro-content');

	function changeIntro(role) {
		introContent.classList.add('fade-out');

		setTimeout(() => {
			const content = introData[role];
			mainImage.src = content.imageUrl;
			mainImage.alt = content.name;
			introTitle.innerHTML = `안녕하세요<br> 디파인더바디 ${content.role} ${content.name}입니다.`;
			introText.innerHTML = content.message;

			buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.role === role));

			introContent.classList.remove('fade-out');
			introContent.classList.add('fade-in');

			setTimeout(() => {
				introContent.classList.remove('fade-in');
			}, 500);
		}, 500);
	}

	buttons.forEach(button => {
		button.addEventListener('click', () => changeIntro(button.dataset.role));
	});

	// 초기 인사말 설정 (애니메이션 없이)
	const initialRole = 'ceo';
	const initialContent = introData[initialRole];
	mainImage.src = initialContent.imageUrl;
	mainImage.alt = initialContent.name;
	introTitle.innerHTML = `안녕하세요<br> 디파인더바디 ${initialContent.role} ${initialContent.name}입니다.`;
	introText.innerHTML = initialContent.message;
});

window.addEventListener('load', function() {
	if (sessionStorage.getItem('adminLoggedIn') === 'true') {
		document.body.classList.add('admin-logged-in');
		if (typeof makeContentEditable === 'function') {
			makeContentEditable(true);
		}
	}
});

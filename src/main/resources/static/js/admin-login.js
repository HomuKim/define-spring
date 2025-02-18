console.log('DOMContentLoaded event fired');

document.addEventListener('DOMContentLoaded', function() {
	console.log('DOMContentLoaded 이벤트 리스너 실행');

	const modal = document.getElementById('adminLoginModal');
	const loginBtn = document.getElementById('adminLoginLink');
	const closeBtn = document.querySelector('.admin-login-close');
	const loginForm = document.getElementById('adminLoginForm');
	const logoutBtn = document.getElementById('adminLogoutButton');

	console.log('Modal:', modal);
	console.log('Login button:', loginBtn);
	console.log('Close button:', closeBtn);
	console.log('Login form:', loginForm);
	console.log('Logout button:', logoutBtn);

	console.log('Login button click listener added');
	loginBtn.addEventListener('click', () => {
		console.log('Login button clicked');
		modal.style.display = 'block';
	});

	closeBtn.onclick = () => modal.style.display = 'none';
	window.onclick = (e) => e.target === modal && (modal.style.display = 'none');

	console.log('Form submit listener added');
	loginForm.addEventListener('submit', async (e) => {
		console.log('Form submitted');
		e.preventDefault();
		const formData = new URLSearchParams(new FormData(loginForm));

		try {
			const response = await fetch('/admin/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData,
				credentials: 'include'
			});

			const data = await response.json();

			if (response.ok) {
				if (data.success) {
					window.location.href = currentPageUrl;
				} else {
					alert(data.message || '로그인 실패');
				}
			} else if (response.status === 401) {
				alert('아이디 또는 비밀번호가 잘못되었습니다.');
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error('Login error:', error);
			alert('서버 연결 오류');
		}

	});

	const submitBtn = loginForm.querySelector('button[type="submit"]');
	submitBtn.addEventListener('click', (e) => {
		console.log('Submit button clicked');
		e.preventDefault();
		loginForm.dispatchEvent(new Event('submit'));
	});


	logoutBtn.addEventListener('click', async () => {
		try {
			const response = await fetch('/admin/api/logout', {
				method: 'POST',
				credentials: 'include'
			});

			if (response.ok) {
				hideEditButtons();
				logoutBtn.style.display = 'none';
				alert('로그아웃 되었습니다');
				window.location.reload();
			} else {
				throw new Error('로그아웃 실패');
			}
		} catch (error) {
			console.error('Logout error:', error);
			alert('로그아웃 중 오류 발생');
		}
	});

	async function checkAdminStatus() {
		try {
			const response = await fetch('/admin/api/status', {
				credentials: 'include'
			});
			if (response.ok) {
				const data = await response.json();
				updateAdminUI(data.isAdmin);
			} else {
				updateAdminUI(false);
			}
		} catch (error) {
			console.error('Admin status check failed:', error);
			updateAdminUI(false);
		}
	}

	function updateAdminUI(isAdmin) {
		if (isAdmin) {
			showEditButtons();
			logoutBtn.style.display = 'inline-block';
		} else {
			hideEditButtons();
			logoutBtn.style.display = 'none';
		}
	}

	const showEditButtons = () => {
		document.querySelectorAll('.editable').forEach(el => el.setAttribute('contenteditable', 'true'));
	};

	const hideEditButtons = () => {
		document.querySelectorAll('.editable').forEach(el => el.setAttribute('contenteditable', 'false'));
	};

	checkAdminStatus();
});

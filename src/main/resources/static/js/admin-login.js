document.addEventListener('DOMContentLoaded', function() {
	// 모달 관련 요소 선택
	const modal = document.getElementById('adminLoginModal');
	const loginBtn = document.getElementById('adminLoginLink');
	const closeBtn = document.querySelector('.admin-login-close');
	const loginForm = document.getElementById('adminLoginForm');
	const logoutBtn = document.getElementById('adminLogoutButton');

	// CSRF 토큰 추출 함수
	function getCsrfToken() {
		return document.querySelector('meta[name="_csrf"]').content;
	}

	// 모달 제어 로직
	loginBtn.onclick = () => modal.style.display = 'block';
	closeBtn.onclick = () => modal.style.display = 'none';
	window.onclick = (e) => e.target === modal && (modal.style.display = 'none');

	// 로그인 처리
	loginForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const csrfToken = getCsrfToken();
		const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

		if (!csrfToken) {
			alert('보안 토큰이 존재하지 않습니다. 페이지를 새로고침 해주세요.');
			return;
		}

		const formData = new URLSearchParams(new FormData(loginForm));

		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: {
					[csrfHeader]: csrfToken,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData,
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				window.location.href = '/admin/dashboard';
			} else {
				alert(data.message || '로그인 실패');
			}
		} catch (error) {
			console.error('Login error:', error);
			alert('서버 연결 오류');
		}
	});

	// 로그아웃 처리
	logoutBtn.addEventListener('click', async () => {
		try {
			const response = await fetch('/admin/logout', {
				method: 'POST',
				headers: {
					'X-CSRF-TOKEN': getCsrfToken()
				},
				credentials: 'include'
			});

			if (response.ok) {
				sessionStorage.removeItem('adminLoggedIn');
				hideEditButtons();
				logoutBtn.style.display = 'none';
				alert('로그아웃 되었습니다');
			} else {
				throw new Error('로그아웃 실패');
			}
		} catch (error) {
			console.error('Logout error:', error);
			alert('로그아웃 중 오류 발생');
		}
	});

	// 관리자 상태 확인
	const checkAdminStatus = async () => {
		try {
			const response = await fetch('/admin/status', {
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error(`서버 응답 오류: ${response.status}`);
			}

			const contentType = response.headers.get('content-type');
			if (!contentType?.includes('application/json')) {
				throw new TypeError("잘못된 형식의 응답");
			}

			const data = await response.json();

			if (data.isAdmin) {
				showEditButtons();
				logoutBtn.style.display = 'inline-block';
			} else {
				hideEditButtons();
				logoutBtn.style.display = 'none';
			}
		} catch (error) {
			console.error('상태 확인 실패:', error);
			hideEditButtons();
			logoutBtn.style.display = 'none';
		}
	};

	// UI 제어 함수
	const showEditButtons = () => {
		document.querySelectorAll('.edit-button').forEach(btn => btn.style.display = 'inline-block');
	};

	const hideEditButtons = () => {
		document.querySelectorAll('.edit-button').forEach(btn => btn.style.display = 'none');
	};

	// 초기 실행
	checkAdminStatus();
});

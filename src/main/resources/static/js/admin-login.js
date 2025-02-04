document.addEventListener('DOMContentLoaded', function() {
	// 모달 관련 요소 선택
	const modal = document.getElementById('adminLoginModal');
	const loginBtn = document.getElementById('adminLoginLink');
	const closeBtn = document.querySelector('.admin-login-close');
	const loginForm = document.getElementById('adminLoginForm');
	const logoutBtn = document.getElementById('adminLogoutButton');

	// CSRF 토큰 추출 함수
	function getCsrfToken() {
		return document.querySelector('input[name="_csrf"]').value;
	}

	// 모달 제어 로직
	loginBtn.onclick = () => modal.style.display = 'block';
	closeBtn.onclick = () => modal.style.display = 'none';
	window.onclick = (e) => e.target === modal && (modal.style.display = 'none');

	// 로그인 처리
	loginForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new URLSearchParams(new FormData(loginForm));
		const csrfToken = getCsrfToken();

		try {
			const response = await fetch('/admin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-XSRF-TOKEN': csrfToken
				},
				credentials: 'include',
				body: formData
			});

			if (response.ok) {
				checkAdminStatus();
				modal.style.display = 'none';
				window.location.reload(); // 페이지 새로고침으로 상태 동기화
			} else {
				alert('로그인 실패: 잘못된 계정 정보');
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
					'X-XSRF-TOKEN': getCsrfToken()
				},
				credentials: 'include'
			});

			if (response.ok) {
				sessionStorage.removeItem('adminLoggedIn');
				hideEditButtons();
				logoutBtn.style.display = 'none';
				alert('로그아웃 되었습니다');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	});

	// 관리자 상태 확인
	const checkAdminStatus = async () => {
		try {
			const response = await fetch('/admin/status', {
				credentials: 'include'
			});
			const data = await response.json();

			if (data.isAdmin) {
				showEditButtons();
				logoutBtn.style.display = 'inline-block';
			} else {
				hideEditButtons();
				logoutBtn.style.display = 'none';
			}
		} catch (error) {
			console.error('Status check error:', error);
		}
	};

	// UI 제어 함수
	const showEditButtons = () => {
		document.querySelectorAll('.edit-button').forEach(btn => {
			btn.style.display = 'inline-block';
		});
	};

	const hideEditButtons = () => {
		document.querySelectorAll('.edit-button').forEach(btn => {
			btn.style.display = 'none';
		});
	};

	// 초기 실행
	checkAdminStatus();
});

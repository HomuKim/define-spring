document.addEventListener('DOMContentLoaded', function() {
	var modal = document.getElementById('adminLoginModal');
	var btn = document.getElementById('adminLoginLink');
	var span = document.getElementsByClassName('admin-login-close')[0];
	var form = document.getElementById('adminLoginForm');

	// 버튼 클릭시 모달 열기
	btn.onclick = function() {
		modal.style.display = 'block';
	}

	// X 클릭시 모달 닫기
	span.onclick = function() {
		modal.style.display = 'none';
	}

	// 모달 외부 클릭시 모달 닫기
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	}

	// 폼 제출 처리
	form.onsubmit = function(e) {
		e.preventDefault();
		var username = document.getElementById('adminUsername').value;
		var password = document.getElementById('adminPassword').value;

		fetch('/admin/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: username, password: password })
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					alert('로그인 성공!');
					checkAdminStatus(); // 로그인 성공 시 관리자 상태 확인
					modal.style.display = 'none'; // 모달 닫기
				} else {
					alert('로그인 실패. 비밀번호를 확인해주세요.');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				alert('로그인 중 오류가 발생했습니다.');
			});
	}

	// 관리자 상태 확인 및 UI 업데이트 함수
	function checkAdminStatus() {
		fetch('/admin/status')
			.then(response => response.json())
			.then(data => {
				if (data.isAdmin) {
					showEditButtons();
				} else {
					hideEditButtons();
				}
			});
	}

	function showEditButtons() {
		document.querySelectorAll('.edit-button').forEach(button => {
			button.style.display = 'inline-block';
		});
	}

	function hideEditButtons() {
		document.querySelectorAll('.edit-button').forEach(button => {
			button.style.display = 'none';
		});
	}

	// 페이지 로드 시 관리자 상태 확인
	checkAdminStatus();
});

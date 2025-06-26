// 페이지 전체가 로드되면 header와 footer를 각각 불러옴
window.addEventListener('load', function () {
    $("#header").load("header.html", function () {
        if (typeof initializeHeader === 'function') {
            initializeHeader();
        }
    });
    $("#footer").load("footer.html");
});

document.addEventListener('DOMContentLoaded', function () {
    // 페이지 로드 후 fade-out 클래스 제거 (페이드 인 효과)
    setTimeout(() => {
        document.body.classList.remove('fade-out');
    }, 10);

    // 링크 클릭 시 페이드 아웃 효과 적용
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', event => {
            if (document.body.classList.contains('fade-out')) return; // 중복 방지
            event.preventDefault();
            const url = link.getAttribute('href');
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = url;
            }, 700);
        });
    });

    // 이벤트 배너 관련 DOM 요소 가져오기
    const eventImage = document.getElementById('eventImage');
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // 이미지 파일이 실제로 존재하는지 확인하는 함수 (Promise 반환)
    function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // 이미지가 존재하는 이벤트만 필터링해서 반환 (비동기)
    async function filterEventsByImage(events) {
        const filtered = [];
        for (const event of events) {
            if (await imageExists(event.imageUrl)) { // ※ imageUrl로 수정 필요!
                filtered.push(event);
            }
        }
        return filtered;
    }

    // 백엔드 API에서 데이터를 받아옴
    async function fetchEvents() {
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error('이벤트 데이터를 불러오지 못했습니다.');
        }
        return await response.json();
    }

    // 이벤트 초기화: 백엔드에서 데이터를 받아와서 처리
    async function initEvents() {
        let events;
        try {
            events = await fetchEvents();
        } catch (error) {
            console.error(error);
            // 데이터를 못 받아온 경우, 기본 데이터 또는 에러 메시지 표시
            events = [
                {
                    imageUrl: 'images/event/event-banner1.jpg',
                    title: '이벤트 데이터를 불러오지 못했습니다.',
                    description: '새로고침하거나 나중에 다시 시도해 주세요.'
                }
            ];
        }

        // 이미지가 존재하는 이벤트만 필터링
        const filteredEvents = await filterEventsByImage(events);

        // 이벤트가 1개 이하라면 화살표 버튼 숨김
        if (filteredEvents.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }

        // 이벤트가 0개라면 전체 이벤트 섹션 숨김
        if (filteredEvents.length === 0) {
            document.getElementById('eventsection').style.display = 'none'; // id 확인!
            return;
        }

        // 현재 보여지는 이벤트 인덱스
        let currentIndex = 0;

        // 실제 이벤트 내용을 화면에 표시하는 함수 (애니메이션 포함)
        function updateEvent(index) {
            const event = filteredEvents[index];
            eventImage.style.display = '';
            eventImage.classList.add('fade-out');
            eventTitle.classList.add('fade-out');
            eventDescription.classList.add('fade-out');

            setTimeout(() => {
                eventImage.src = event.imageUrl; // ※ imageUrl로 수정!
                eventTitle.textContent = event.title;
                eventDescription.innerHTML = event.description;

                eventImage.classList.remove('fade-out');
                eventImage.classList.add('fade-in');
                eventTitle.classList.remove('fade-out');
                eventTitle.classList.add('fade-in');
                eventDescription.classList.remove('fade-out');
                eventDescription.classList.add('fade-in');

                setTimeout(() => {
                    eventImage.classList.remove('fade-in');
                    eventTitle.classList.remove('fade-in');
                    eventDescription.classList.remove('fade-in');
                }, 300);
            }, 300);
        }

        // 이전/다음 버튼 클릭 시 이벤트 변경
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + filteredEvents.length) % filteredEvents.length;
            updateEvent(currentIndex);
        });
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % filteredEvents.length;
            updateEvent(currentIndex);
        });

        // 첫 번째 이벤트 표시
        updateEvent(currentIndex);
    }

    // 이벤트 영역 초기화 실행
    initEvents();
});

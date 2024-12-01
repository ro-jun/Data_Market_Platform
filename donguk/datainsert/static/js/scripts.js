document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('files');
    const fileList = document.getElementById('file-list');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const closePopup = document.getElementById('close-popup');

    // 드롭존 클릭 이벤트로 파일 선택 열기
    dropzone.addEventListener('click', () => {
        fileInput.click(); // 파일 입력 창 열기
    });

    // 파일 선택 이벤트 처리
    fileInput.addEventListener('change', () => {
        fileList.innerHTML = ''; // 기존 파일 리스트 초기화
        Array.from(fileInput.files).forEach((file) => {
            const li = document.createElement('li');
            li.textContent = file.name;

            // 삭제 버튼 추가
            const removeButton = document.createElement('span');
            removeButton.textContent = ' ❌';
            removeButton.classList.add('remove-file');
            removeButton.addEventListener('click', () => {
                li.remove(); // 리스트에서 파일 삭제
            });

            li.appendChild(removeButton);
            fileList.appendChild(li);
        });
    });

    // 폼 제출 이벤트 처리
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 폼 데이터 수집
        const formData = new FormData(form);
        const files = Array.from(fileInput.files).map(file => file.name);

        const data = {
            title: formData.get('title'),
            price: formData.get('price'),
            category: formData.get('category'),
            description: formData.get('description'),
            files: files
        };

        try {
            // 서버로 데이터 전송
            const response = await fetch('/submit-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                popupMessage.textContent = result.message || "등록이 완료되었습니다!";
                popup.classList.remove('hidden'); // 팝업 표시
            } else {
                alert(result.message || "서버에서 에러가 발생했습니다.");
            }
        } catch (error) {
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    });

    // 팝업 닫기
    closePopup.addEventListener('click', () => {
        popup.classList.add('hidden'); // 팝업 숨기기
        form.reset(); // 폼 초기화
        fileList.innerHTML = ''; // 파일 리스트 초기화
    });
});

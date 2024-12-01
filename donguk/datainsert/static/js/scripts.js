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

        const formData = new FormData(form);
        const files = Array.from(document.getElementById('files').files).map(file => file.name);

        const data = {
            title: formData.get('title'),
            price: formData.get('price'),
            category: formData.get('category'),
            description: formData.get('description'),
            files: files
        };

        try {
            const response = await fetch('/submit-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // 응답 처리
            const result = await response.json();
            console.log('응답 결과:', result); // 디버깅용 로그
            if (response.ok && result.success) {
                popupMessage.textContent = result.message || "등록이 완료되었습니다!";
                popup.style.display = 'block'; // 팝업 표시
            } else {
                alert(result.message || "서버에서 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error('에러 발생:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    });

    // 팝업 닫기
    closePopup.addEventListener('click', () => {
        popup.style.display = 'none'; // 팝업 숨기기
        form.reset(); // 폼 초기화
        document.getElementById('file-list').innerHTML = ''; // 파일 리스트 초기화
    });
});
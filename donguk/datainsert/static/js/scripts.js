// 드래그 앤 드롭: 추가 파일 영역에서만 작동
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('files');
const fileList = document.getElementById('file-list');

// 드래그 앤 드롭 이벤트 핸들러
dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('dragging');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragging');
});

dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('dragging');

    const files = event.dataTransfer.files;
    updateFileList(files);
});

// 클릭 시 파일 업로드 창 열기 (추가 파일 영역에서만 작동)
dropzone.addEventListener('click', () => {
    fileInput.click();
});

// 파일 선택 이벤트
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    updateFileList(files);
});

// 파일 리스트 업데이트
function updateFileList(files) {
    fileList.innerHTML = ''; // 기존 파일 리스트 초기화
    Array.from(files).forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;

        // 삭제 버튼 추가
        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.style.marginLeft = '10px';
        removeButton.onclick = () => {
            removeFile(index);
        };

        listItem.appendChild(removeButton);
        fileList.appendChild(listItem);
    });
}

// 특정 파일 삭제
function removeFile(index) {
    const dt = new DataTransfer();
    const files = fileInput.files;

    Array.from(files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });

    fileInput.files = dt.files; // 파일 리스트 업데이트
    fileInput.dispatchEvent(new Event('change')); // 파일 리스트 변경 이벤트 트리거
}

document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const closePopupButton = document.getElementById('close-popup');
    const form = document.getElementById('data-form');

    // 폼 제출 이벤트 처리
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // 실제 제출은 막음 (테스트용)

        // 서버에 데이터 전송 로직 (fetch나 AJAX를 통해 서버로 데이터 전송)
        // 이 부분에서 실제 데이터를 서버로 보냄
        const formData = new FormData(form);

        // 서버 응답이 성공적이라고 가정하고 팝업을 띄움
        popup.classList.remove('hidden');
    });

    // 팝업 닫기 버튼 클릭 이벤트
    closePopupButton.addEventListener('click', () => {
        popup.classList.add('hidden'); // 팝업 숨김
        form.reset(); // 폼 초기화
    });
});

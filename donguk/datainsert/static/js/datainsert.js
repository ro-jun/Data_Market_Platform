document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('files');
    const fileList = document.getElementById('file-list');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const closePopup = document.getElementById('close-popup');
    const mainCategory = document.getElementById('main-category');
    const subCategory = document.getElementById('sub-category');

    const categoryData = {
        "리포트": ["경영/경제", "공학/기술", "교육학", "농수산학", "특허감/창작", "법학", "사회과학", "생활/환경", "예체능", "의/약학", "인문/어학", "자연과학", "창업"],
        "논문": ["인문학", "사회과학", "자연과학", "공학", "농수해양학", "의약학", "예술체육학", "학위논문"],
        "자기소개서": ["취업", "학교", "작성법", "면접준비", "기타"],
        "방송통신대": ["중간시험", "기말시험", "계절시험", "핵심요약노트", "출석대체 시험/과제"],
        "서식": ["각종계약서", "건설서식", "교육서식", "법률서식", "부서별서식", "생활서식", "업무서식", "회사서식"],
        "노하우": ["구매/판매대행", "글쓰기", "데이터분석", "마케팅", "블로그/스토어", "유튜브", "전자책/출판"]
    };

    // 1계층 변경 시 2계층 업데이트
    mainCategory.addEventListener('change', () => {
        const selectedMain = mainCategory.value;
        console.log(`선택된 메인 카테고리: ${selectedMain}`); // 디버깅 로그 추가

        const subOptions = categoryData[selectedMain] || [];
        console.log(`세부 옵션: ${subOptions}`); // 디버깅 로그 추가

        // 기존 옵션 초기화
        subCategory.innerHTML = '<option value="">세부 옵션 선택</option>';
        subOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            subCategory.appendChild(opt);
        });
    });

    // 드롭존 클릭 시 파일 선택 창 열기
    dropzone.addEventListener('click', () => fileInput.click());

    // 파일 선택 시 리스트에 표시
    fileInput.addEventListener('change', () => {
        fileList.innerHTML = ''; // 기존 파일 리스트 초기화
        Array.from(fileInput.files).forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;

            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-file');
            removeButton.addEventListener('click', () => listItem.remove());

            listItem.appendChild(removeButton);
            fileList.appendChild(listItem);
        });
    });

    // 폼 제출 이벤트
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form); // 파일 포함 모든 데이터를 전송

        try {
            const response = await fetch('/datainsert/submit-data', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok && result.success) {
                popupMessage.textContent = result.message || "등록이 완료되었습니다!";
                popup.classList.add('visible'); // 팝업 표시
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
        popup.classList.remove('visible');
        form.reset();
        fileList.innerHTML = '';
    });

    // 썸네일 업로드 처리
    const thumbnailDropzone = document.getElementById('thumbnail-dropzone');
    const thumbnailInput = document.getElementById('thumbnail');
    const thumbnailPreview = document.getElementById('thumbnail-preview');

    thumbnailDropzone.addEventListener('click', () => thumbnailInput.click());

    thumbnailInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        thumbnailPreview.innerHTML = '';

        if (file) {
            const fileType = file.type;
            const validImageTypes = ['image/jpeg', 'image/png'];

            if (!validImageTypes.includes(fileType)) {
                alert('썸네일은 jpg 또는 png 파일만 업로드할 수 있습니다.');
                thumbnailInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                thumbnailPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
});

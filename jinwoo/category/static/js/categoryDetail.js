function scrollAnalysis(direction) {
    const container = document.getElementById('analysis-section');
    const scrollAmount = container.clientWidth / 3;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}
function openReviewPopup() {
    const popup = document.getElementById('reviewPopup');
    popup.style.display = 'flex'; // 팝업을 flex를 사용하여 중앙 정렬
    document.body.style.overflow = 'hidden'; // 팝업이 열렸을 때 배경 스크롤 방지
    console.log('리뷰 작성 팝업이 열렸습니다.');
}

function closeReviewPopup() {
    const popup = document.getElementById('reviewPopup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto'; // 팝업이 닫혔을 때 스크롤 복원
    console.log('리뷰 작성 팝업이 닫혔습니다.');
}

function submitReview() {
    console.log("리뷰가 제출되었습니다.");
    // 리뷰 제출 처리 로직 추가
    closeReviewPopup();
}

// 이미지 선택 시 미리보기 기능
document.getElementById('reviewImage').addEventListener('change', function(event) {
    const selectedFile = event.target.files[0];
    const previewContainer = document.getElementById('selectedImagePreview');
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="이미지 미리보기" style="max-width: 100%; height: auto; margin-top: 10px;">`;
        };
        reader.readAsDataURL(selectedFile);
    } else {
        previewContainer.innerHTML = '';
    }
});

// 팝업 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('reviewPopup');
    if (event.target == modal) {
        closeReviewPopup();
        console.log('팝업 외부를 클릭하여 팝업이 닫혔습니다.');
    }
}
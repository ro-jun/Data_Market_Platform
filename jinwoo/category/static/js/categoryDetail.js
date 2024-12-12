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

document.addEventListener('DOMContentLoaded', function() {
    const reviewScore = document.getElementById('reviewScore');
    const stars = reviewScore.querySelectorAll('.star');
    let currentRating = 0; // 현재 확정된 별점
    let hoverRating = 0;   // 마우스 호버 시 임시 별점

    // 마우스가 별 위에 올라갔을 때 해당 별 점수만큼 채우기
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            hoverRating = parseInt(star.getAttribute('data-value'), 10);
            updateStars(hoverRating);
        });
    });

    // 마우스가 영역을 벗어나면 확정된 별점으로 복원
    reviewScore.addEventListener('mouseleave', () => {
        updateStars(currentRating);
    });

    // 클릭 시 별점을 확정
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-value'), 10);
            console.log('선택된 별점:', currentRating);
            updateStars(currentRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'), 10);
            if (starValue <= rating) {
                star.textContent = '★';
                star.classList.add('filled');
            } else {
                star.textContent = '☆';
                star.classList.remove('filled');
            }
        });
    }

    // 초기 상태는 별점 0
    updateStars(currentRating);
});

document.addEventListener('DOMContentLoaded', () => {
    const addTagButton = document.getElementById('addTagButton');
    const tagPopup = document.getElementById('tagPopup');
    const confirmTagButton = document.getElementById('confirmTagButton');
    const cancelTagButton = document.getElementById('cancelTagButton');
    const newTagInput = document.getElementById('newTagInput');
    const tagSection = document.querySelector('.tag-section');

    // + 버튼을 누르면 팝업 보이기
    addTagButton.addEventListener('click', () => {
        tagPopup.style.display = 'block';
        newTagInput.value = '';
        newTagInput.focus();
    });

    // 확인 버튼 누르면 태그 추가
    confirmTagButton.addEventListener('click', () => {
        const tagName = newTagInput.value.trim();
        if (tagName !== '') {
            const newTagButton = document.createElement('button');
            newTagButton.classList.add('tag-button');
            newTagButton.textContent = tagName;
            // 새로운 태그 버튼은 + 버튼 뒤에 삽입
            tagSection.insertBefore(newTagButton, addTagButton.nextSibling);
        }
        tagPopup.style.display = 'none';
    });

    // 취소 버튼 누르면 팝업 숨기기
    cancelTagButton.addEventListener('click', () => {
        tagPopup.style.display = 'none';
    });

    // 팝업 외부 클릭 시 팝업 닫기 (선택사항)
    window.addEventListener('click', (event) => {
        if (event.target === tagPopup) {
            tagPopup.style.display = 'none';
        }
    });
});


// 팝업 내 요소를 가져올 변수 선언 (DOMContentLoaded 이후 초기화)
let currentRating = 0; // 별점 관리 변수 (이미 적용되어 있다 가정)
document.addEventListener('DOMContentLoaded', () => {
    const reviewPopup = document.getElementById('reviewPopup');
    const reviewText = document.getElementById('reviewText');
    const reviewImage = document.getElementById('reviewImage');
    const selectedImagePreview = document.getElementById('selectedImagePreview');
    const tagSection = document.querySelector('.tag-section');
    const addTagButton = document.getElementById('addTagButton'); // + 버튼
    const newTagInput = document.getElementById('newTagInput');   // 태그 추가용 input (있다면)
    const reviewScore = document.getElementById('reviewScore');   // 별점 영역
    const stars = reviewScore.querySelectorAll('.star');          // 별 요소들

    // 별점 업데이트 함수 (이미 존재한다고 가정)
    function updateStars(rating) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'), 10);
            if (starValue <= rating) {
                star.textContent = '★';
                star.classList.add('filled');
            } else {
                star.textContent = '☆';
                star.classList.remove('filled');
            }
        });
    }

    // 리뷰 폼 초기화 함수
    function resetReviewForm() {
        // 별점 초기화
        currentRating = 0;
        updateStars(currentRating);

        // 리뷰 텍스트 초기화
        reviewText.value = '';

        // 이미지 첨부 초기화
        reviewImage.value = '';
        selectedImagePreview.innerHTML = '';

        // 태그 초기화 (+ 버튼 제외 모든 태그 버튼 제거)
        const tagButtons = tagSection.querySelectorAll('.tag-button');
        tagButtons.forEach(tagButton => {
            if (tagButton !== addTagButton) {
                tagButton.remove();
            }
        });
    }

    // 리뷰 팝업 닫기 함수 (이미 존재한다고 가정)
    function closeReviewPopup() {
        const popup = document.getElementById('reviewPopup');
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('리뷰 작성 팝업이 닫혔습니다.');
        resetReviewForm(); // 팝업 닫을 때 폼 초기화
    }

    // 취소 버튼 클릭 시 팝업 닫기 예시
    const cancelButton = document.querySelector('.popup-content .close-button'); 
    // 위 selector는 기존 HTML 구조에 따라 조정 필요
    // <button class="close-button" onclick="closeReviewPopup()">취소</button> 이 있다고 가정

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            closeReviewPopup();
        });
    }

    // 팝업 외부 클릭 시 닫기 로직에서도 폼 초기화 동작
    window.onclick = function(event) {
        const modal = document.getElementById('reviewPopup');
        if (event.target == modal) {
            closeReviewPopup();
        }
    }
});

function handlePartialPurchase() {
    document.getElementById('purchaseModal').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function confirmPurchase() {
    const countInput = document.getElementById('countInput');
    const count = parseInt(countInput.value, 10);
    if (!isNaN(count) && count > 0) {
        const price = count * 220; // 예: 개수 * 1000원
        // 구매 완료 모달에 가격 표시
        document.getElementById('purchaseResult').textContent = `${price}원으로 구매되었습니다.`;
        closeModal('purchaseModal');
        // 구매 완료 모달 열기
        document.getElementById('resultModal').style.display = 'block';
    } else {
        alert('올바른 숫자를 입력해주세요.');
    }
}
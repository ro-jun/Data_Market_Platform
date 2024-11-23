document.addEventListener("DOMContentLoaded", () => {
    // 버튼 ID
    const buttons = {
        findData: "데이터 찾기를 클릭했습니다!",
        buyData: "삽니다 버튼을 클릭했습니다!",
        sellData: "팝니다 버튼을 클릭했습니다!",
        freeData: "무료 데이터를 클릭했습니다!"
    };

document.getElementById('profile-btn').addEventListener('click', () => {
  window.location.href = 'profile.html';
});

document.getElementById('purchase-data-btn').addEventListener('click', () => {
  window.location.href = 'purchase-data.html';
});

document.getElementById('wishlist-btn').addEventListener('click', () => {
  window.location.href = 'wishlist.html';
});

document.getElementById('recent-view-btn').addEventListener('click', () => {
  window.location.href = 'recent-view.html';
});

document.getElementById('sales-data-btn').addEventListener('click', () => {
  window.location.href = 'sales-data.html';
});
    // 각 버튼에 이벤트 추가
    for (const [id, message] of Object.entries(buttons)) {
        document.getElementById(id).addEventListener("click", () => {
            alert(message);
        });
    }
});

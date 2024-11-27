document.addEventListener('DOMContentLoaded', function() {
    const contentArea = document.getElementById('content-area');

    function loadContent(content) {
        contentArea.innerHTML = content;
    }

    document.getElementById('profile-btn').addEventListener('click', function() {
        loadContent('<h2>프로필</h2><p>여기에 프로필 내용이 표시됩니다.</p>');
    });

    document.getElementById('purchase-data-btn').addEventListener('click', function() {
        loadContent('<h2>구매 데이터 관리</h2><p>구매한 데이터 목록이 여기에 표시됩니다.</p>');
    });

    document.getElementById('wishlist-btn').addEventListener('click', function() {
        loadContent('<h2>찜한 데이터</h2><p>찜한 데이터 목록이 여기에 표시됩니다.</p>');
    });

    document.getElementById('recent-view-btn').addEventListener('click', function() {
        loadContent('<h2>최근 본 데이터</h2><p>최근에 본 데이터 목록이 여기에 표시됩니다.</p>');
    });

    document.getElementById('sales-data-btn').addEventListener('click', function() {
        loadContent('<h2>판매 데이터 관리</h2><p>판매 중인 데이터 목록이 여기에 표시됩니다.</p>');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // 페이지가 로드되면 기본 설정 스크립트 등 초기화 가능
});

function showFilterAndExpandCard(categoryId) {
    // 필터 섹션을 보이게 설정
    const filterSection = document.getElementById('filter-section');
    filterSection.style.display = 'block';

    // 모든 카드 숨기기
    const allProductCards = document.querySelectorAll('.product-card');
    allProductCards.forEach(card => card.style.display = 'none');

    // 선택된 상품 카드를 보이도록 설정
    const selectedProductsContainer = document.getElementById('selected-products-container');
    selectedProductsContainer.innerHTML = ''; // 기존 카드 초기화

    // 예시 데이터를 사용해 카드 추가 (실제 데이터 사용 시 서버에서 데이터를 받아와서 렌더링)
    const categories = [
        { id: "sneakers", name: "Sneakers", image_url: "/category/static/category/images/sneakers.jpg" },
        { id: "sofa", name: "Sofa", image_url: "/category/static/category/images/sofa.png" },
        { id: "toy_train", name: "Toy Train", image_url: "/category/static/category/images/toy.png" },
        { id: "party_decors", name: "Party Decors", image_url: "/category/static/category/images/party.png" },
        { id: "diamond_ring", name: "Diamond Ring", image_url: "/category/static/category/images/diamond.png" },
    ];

    // 선택한 카드와 그 다음 3개의 카드를 찾음
    const selectedIndex = categories.findIndex(category => category.id === categoryId);
    const cardsToShow = [categories[selectedIndex]];

    // 추가적으로 그 다음 3개의 카드를 추가
    for (let i = 1; i <= 3; i++) {
        const nextIndex = (selectedIndex + i) % categories.length;
        cardsToShow.push(categories[nextIndex]);
    }

    // 선택한 카드와 추가 3개의 카드 렌더링
    cardsToShow.forEach((category, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'product-card';

        // 첫 번째 카드(선택된 카드)는 가로로 2열을 차지
        if (index === 0) {
            cardElement.classList.add('selected-product-card');
            cardElement.style.gridColumn = 'span 2';
            cardElement.style.border = '3px solid #007bff';
        }

        cardElement.innerHTML = `
            <img src="${category.image_url}" alt="${category.name}" class="product-image">
            <div class="product-info">
                <p class="category">${category.name}</p>
                <h3>${category.name}</h3>
            </div>
        `;

        // 카드 클릭 시 동일한 함수 호출
        cardElement.onclick = () => showFilterAndExpandCard(category.id);

        selectedProductsContainer.appendChild(cardElement);
    });

    // 상세 데이터셋 목록 표시 (데이터셋 목록 컨테이너)
    showDatasetList(categoryId);
}



function showDatasetList(categoryId) {
    const datasetListContainer = document.getElementById('dataset-list-container');
    datasetListContainer.innerHTML = ''; // 기존 데이터셋 초기화

    // 예시 데이터셋 (실제 데이터셋 사용 시 서버에서 데이터를 받아와서 렌더링)
    const datasetList = {
        "sneakers": [
            {
                brand: "Nike",
                title: "2024 나이키 서울 판매 집계",
                description: "Mollit in laborum tempor Lorem incididunt irure.",
                price: "₩5000원",
                location: "서울",
                fileType: "CSV",
                time: "29분 전"
            },
            {
                brand: "Adidas",
                title: "2024 아디다스 서울 판매 집계",
                description: "Adipisicing elit Lorem incididunt eiusmod.",
                price: "₩4500원",
                location: "서울",
                fileType: "CSV",
                time: "1시간 전"
            },
            {
                brand: "New Balance",
                title: "2024 뉴발란스 서울 판매 집계",
                description: "Ut labore et dolore magna aliqua.",
                price: "₩4000원",
                location: "서울",
                fileType: "CSV",
                time: "2시간 전"
            },
            {
                brand: "Nike",
                title: "2024 나이키 서울 판매 집계",
                description: "Mollit in laborum tempor Lorem incididunt irure.",
                price: "₩5000원",
                location: "서울",
                fileType: "CSV",
                time: "29분 전"
            },
            {
                brand: "Adidas",
                title: "2024 아디다스 서울 판매 집계",
                description: "Adipisicing elit Lorem incididunt eiusmod.",
                price: "₩4500원",
                location: "서울",
                fileType: "CSV",
                time: "1시간 전"
            },
            {
                brand: "New Balance",
                title: "2024 뉴발란스 서울 판매 집계",
                description: "Ut labore et dolore magna aliqua.",
                price: "₩4000원",
                location: "서울",
                fileType: "CSV",
                time: "2시간 전"
            }
        ],
        // 다른 카테고리 데이터를 여기에 추가
    };

    // 선택한 카테고리에 해당하는 데이터셋을 가져옴
    const datasets = datasetList[categoryId];
    if (datasets && datasets.length > 0) {
        datasets.forEach(dataset => {
            const datasetElement = document.createElement('div');
            datasetElement.classList.add('dataset-card');
            datasetElement.innerHTML = `
                <img src="/category/static/category/images/nike.png" alt="${dataset.brand}">
                <div class="dataset-info">
                    <h5 style='margin:0'>${dataset.brand}</h4>
                    <h4>${dataset.title}</h3>
                    <p>${dataset.description}</p>
                    <div style='font-size: 0.65rem;'>
                        <span>📍 ${dataset.location}</span> · 
                        <span>📄 ${dataset.fileType}</span> · 
                        <span>💰 ${dataset.price}</span> · 
                        <span>🕒 ${dataset.time}</span>
                    </div>
                </div>
            `;
            datasetElement.onclick = () => {
                location.href = `/category/detail/${categoryId}`; // dataset-card 클릭 시 category_detail 페이지로 이동
            };
            datasetListContainer.appendChild(datasetElement);
        });
    } else {
        datasetListContainer.innerHTML = "<p>해당 카테고리에 데이터셋이 없습니다.</p>";
    }
}

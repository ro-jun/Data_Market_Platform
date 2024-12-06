document.addEventListener("DOMContentLoaded", function () {
    let currentProductPage = 1;
    let currentDatasetPage = 1;
    const itemsPerPage = { product: 5, dataset: 6 };
    let currentMode = 'product'; // 'product' 또는 'dataset'
    let selectedCategoryId = null;
    let allCategories = []; // 모든 카테고리를 저장

    // 페이지네이션 요소
    const paginationSpan = document.querySelector('.pagination span');
    const previousButton = document.querySelector('.pagination button:first-child');
    const nextButton = document.querySelector('.pagination button:last-child');

    // 카테고리 선택 요소
    const categorySelect = document.getElementById('categorySelect');
    const selectedProductsContainer = document.getElementById('selected-products-container');
    const datasetListContainer = document.getElementById('dataset-list-container');

    // 초기 데이터 로드
    fetchCategories(currentProductPage);

    // 카테고리 로드 함수
    function fetchCategories(page = 1) {
        fetch(`/category/api/categories?page=${page}&items_per_page=${itemsPerPage.product}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(categories => {
                if (page === 1) {
                    allCategories = categories; // 첫 페이지 로드 시 전체 카테고리 저장
                } else {
                    allCategories = allCategories.concat(categories); // 추가 페이지 로드 시 누적
                }
                populateProductCards(categories);
                populateCategorySelect(categories);
                const hasNext = categories.length === itemsPerPage.product;
                renderPaginationUI(page, hasNext);
            })
            .catch(error => console.error('Error fetching product categories:', error));
    }

    // 카테고리 선택 요소에 옵션 추가
    function populateCategorySelect(categories) {
        categorySelect.innerHTML = '<option value="">카테고리</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    // 제품 카드 렌더링 함수
    function populateProductCards(categories) {
        selectedProductsContainer.innerHTML = ''; // 기존 카드 초기화

        categories.forEach(category => {
            const cardElement = document.createElement('div');
            cardElement.className = 'product-card';
            cardElement.setAttribute('data-category-id', category.id);
            cardElement.onclick = () => showFilterAndExpandCard(category.id, 1);

            cardElement.innerHTML = `
                <img src="${category.image_url}" alt="${category.name}" class="product-image" style="width:100px; height:100px;">
                <div class="product-info">
                    <p class="category">${category.name}</p>
                    <h3>${category.name}</h3>
                </div>
            `;

            selectedProductsContainer.appendChild(cardElement);
        });
    }

    // 페이지네이션 렌더링 함수
    function renderPaginationUI(current, hasNext) {
        paginationSpan.textContent = `페이지 ${current}`;

        // 이전 버튼 활성화 여부
        previousButton.disabled = (current === 1);

        // 다음 버튼 활성화 여부
        nextButton.disabled = !hasNext;
    }

    // 페이지네이션 버튼 클릭 이벤트
    previousButton.addEventListener('click', previousPage);
    nextButton.addEventListener('click', nextPage);

    // 이전 페이지 함수
    function previousPage() {
        if (currentMode === 'product' && currentProductPage > 1) {
            currentProductPage--;
            fetchCategories(currentProductPage);
        } else if (currentMode === 'dataset' && currentDatasetPage > 1) {
            currentDatasetPage--;
            loadDatasetPage(currentDatasetPage);
        }
    }

    // 다음 페이지 함수
    function nextPage() {
        if (currentMode === 'product') {
            currentProductPage++;
            fetchCategories(currentProductPage);
        } else if (currentMode === 'dataset') {
            currentDatasetPage++;
            loadDatasetPage(currentDatasetPage);
        }
    }

    // 카테고리 카드 클릭 시 호출되는 함수
    function showFilterAndExpandCard(categoryId, page = 1) {
        selectedCategoryId = categoryId;
        currentMode = 'dataset';
        currentDatasetPage = page;

        // 필터 섹션 보이기
        const filterSection = document.getElementById('filter-section');
        filterSection.style.display = 'block';

        // 모든 product-card를 숨기기
        const allProductCards = document.querySelectorAll('.product-card');
        allProductCards.forEach(card => card.style.display = 'none');

        // 선택된 카테고리와 다음 3개 카테고리 표시
        fetch(`/category/api/categories/${categoryId}/expand`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // JSON 데이터 반환
            })
            .then(data => {
                const cardsToShow = data.categories; // 선택된 카드와 추가 카드 리스트
                selectedProductsContainer.innerHTML = ''; // 기존 카드 초기화

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
                        <img src="${category.image_url}" alt="${category.name}" class="product-image" style="width:100px; height:100px;">
                        <div class="product-info">
                            <p class="category">${category.name}</p>
                            <h3>${category.name}</h3>
                        </div>
                    `;

                    // 카드 클릭 시 동일한 함수 호출
                    cardElement.onclick = () => showFilterAndExpandCard(category.id, 1);

                    selectedProductsContainer.appendChild(cardElement);
                });

                // 상세 데이터셋 목록 표시
                loadDatasetPage(1);
            })
            .catch(error => console.error("Error fetching expanded category data:", error));
    }

    // 데이터셋 페이지 로드 함수
    function loadDatasetPage(page) {
        fetch(`/category/api/datasets?category_id=${selectedCategoryId}&page=${page}&items_per_page=${itemsPerPage.dataset}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const datasets = data.datasets;
                datasetListContainer.innerHTML = '';

                if (datasets.length > 0) {
                    datasets.forEach(dataset => {
                        const datasetElement = createDatasetCard(dataset);
                        datasetListContainer.appendChild(datasetElement);
                    });

                    const hasNext = datasets.length === itemsPerPage.dataset;
                    renderPaginationUI(page, hasNext);
                } else {
                    datasetListContainer.innerHTML = "<p>해당 카테고리에 데이터셋이 없습니다.</p>";
                    renderPaginationUI(page, false);
                }
            })
            .catch(error => console.error("Error fetching datasets:", error));
    }

    // 데이터셋 카드 생성 함수
    function createDatasetCard(dataset) {
        const div = document.createElement('div');
        div.classList.add('dataset-card');
        div.innerHTML = `
            <img src="${dataset.image_url}" alt="${dataset.title}" class="dataset-image" style="width:100px; height:100px;">
            <div class="dataset-info">
                <h5>${dataset.title}</h5>
                <p>${dataset.description}</p>
                <div class="dataset-meta" style='font-size: 0.65rem;'>
                    <span>📄 ${dataset.fileType}</span> · 
                    <span>💰 ${dataset.price}</span> · 
                    <span>⌛️ ${dataset.time}</span>
                </div>
            </div>
        `;
        div.onclick = () => {
            location.href = `/category/detail/${selectedCategoryId}`;
        };
        return div;
    }

    // 필터 적용 및 초기화 함수 (추가 구현 필요)
    function applyFilters() {
        // 필터링 로직 구현
        alert('필터가 적용되었습니다.');
    }

    function resetFilters() {
        // 필터 초기화 로직 구현
        alert('필터가 초기화되었습니다.');
    }

    // 검색 수행 함수 (추가 구현 필요)
    function performSearch() {
        const searchQuery = document.getElementById('searchInput').value.trim();
        const selectedCategory = categorySelect.value;

        if (!searchQuery && !selectedCategory) {
            alert("검색어 또는 카테고리를 입력하세요!");
            return;
        }

        let searchUrl = `/category/api/search?`;
        if (searchQuery) {
            searchUrl += `query=${encodeURIComponent(searchQuery)}&`;
        }
        if (selectedCategory) {
            searchUrl += `category=${encodeURIComponent(selectedCategory)}`;
        }

        fetch(searchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 검색 결과를 처리하고 페이지에 표시 (추가 구현 필요)
                console.log("검색 결과:", data);
                datasetListContainer.innerHTML = ''; // 기존 데이터 초기화
                if (data.length > 0) {
                    data.forEach(dataset => {
                        const datasetElement = createDatasetCard(dataset);
                        datasetListContainer.appendChild(datasetElement);
                    });
                    // 페이지네이션 필요 여부 판단
                    const hasNext = data.length === itemsPerPage.dataset;
                    renderPaginationUI(currentDatasetPage, hasNext);
                } else {
                    datasetListContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
                    renderPaginationUI(currentDatasetPage, false);
                }
            })
            .catch(error => {
                console.error("Error performing search:", error);
                datasetListContainer.innerHTML = "<p>검색 중 오류가 발생했습니다. 다시 시도해주세요.</p>";
            });
    }

    // 뒤로 가기 함수 (추가 구현 필요)
    function goBack() {
        window.history.back();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // 상태 관리 객체
    const state = {
        currentProductPage: 1,
        currentDatasetPage: 1,
        itemsPerPage: { product: 5, dataset: 6 },
        currentMode: 'product', // 'product' 또는 'dataset'
        selectedCategoryId: null,
        allCategories: [],
    };

    // DOM 요소 캐싱
    const paginationSpan = document.querySelector('.pagination span');
    const previousButton = document.querySelector('.pagination button:first-child');
    const nextButton = document.querySelector('.pagination button:last-child');
    const categorySelect = document.getElementById('categorySelect');
    const selectedProductsContainer = document.getElementById('selected-products-container');
    const datasetListContainer = document.getElementById('dataset-list-container');
    const filterSection = document.getElementById('filter-section');
    const searchInput = document.getElementById('searchInput');

    // 초기 데이터 로드
    initialize();

    // 초기화 함수
    async function initialize() {
        try {
            await fetchCategories(state.currentProductPage);
            addEventListeners();
        } catch (error) {
            // console.error('Initialization error:', error);
        }
    }

    // 공통 fetch 함수
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            throw error;
        }
    }

    // 카테고리 로드 함수
    async function fetchCategories(page = 1) {
        const url = `/category/api/categories?page=${page}&items_per_page=${state.itemsPerPage.product}`;
        const categories = await fetchData(url);

        if (page === 1) {
            state.allCategories = categories;
        } else {
            state.allCategories = [...state.allCategories, ...categories];
        }

        populateProductCards(categories);
        populateCategorySelect(categories);
        const hasNext = categories.length === state.itemsPerPage.product;
        renderPaginationUI(page, hasNext);
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

    // 제품 카드 템플릿 함수
    function createProductCard(category) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.categoryId = category.id;
        card.addEventListener('click', () => showFilterAndExpandCard(category.name, 1));

        card.innerHTML = `
            <img src="static/category/images/icon/big-category/${category.id}.png" alt="${category.name}" class="product-image" style="width:100px; height:100px;">
            <div class="product-info">
                <h3>${category.name}</h3>
            </div>
        `;

        return card;
    }

    // 제품 카드 렌더링 함수
    function populateProductCards(categories) {
        selectedProductsContainer.innerHTML = '';
        categories.forEach(category => {
            const card = createProductCard(category);
            selectedProductsContainer.appendChild(card);
        });
    }

    // 페이지네이션 UI 렌더링 함수
    function renderPaginationUI(current, hasNext) {
        paginationSpan.textContent = `페이지 ${current}`;
        previousButton.disabled = current === 1;
        nextButton.disabled = !hasNext;
    }

    // 페이지네이션 버튼 이벤트 리스너 추가
    function addEventListeners() {
        previousButton.addEventListener('click', handlePreviousPage);
        nextButton.addEventListener('click', handleNextPage);
        categorySelect.addEventListener('change', handleCategoryChange);
        document.getElementById('applyFilterButton').addEventListener('click', applyFilters);
        document.getElementById('resetFilterButton').addEventListener('click', resetFilters);
        document.getElementById('searchButton').addEventListener('click', performSearch);
        document.getElementById('backButton').addEventListener('click', goBack);
    }

    // 이전 페이지 핸들러
    function handlePreviousPage() {
        if (state.currentMode === 'product' && state.currentProductPage > 1) {
            state.currentProductPage--;
            fetchCategories(state.currentProductPage);
        } else if (state.currentMode === 'dataset' && state.currentDatasetPage > 1) {
            state.currentDatasetPage--;
            loadDatasetPage(state.currentDatasetPage);
        }
    }

    // 다음 페이지 핸들러
    function handleNextPage() {
        if (state.currentMode === 'product') {
            state.currentProductPage++;
            fetchCategories(state.currentProductPage);
        } else if (state.currentMode === 'dataset') {
            state.currentDatasetPage++;
            loadDatasetPage(state.currentDatasetPage);
        }
    }

    // 카테고리 변경 핸들러
    function handleCategoryChange() {
        const selectedCategory = categorySelect.value;
        if (selectedCategory) {
            showFilterAndExpandCard(selectedCategory, 1);
        }
    }

    // 카테고리 카드 클릭 시 호출되는 함수
    async function showFilterAndExpandCard(categoryId, page = 1) {
        try {
            state.selectedCategoryId = categoryId;
            state.currentMode = 'dataset';
            state.currentDatasetPage = page;
            console.log(categoryId)

            // 필터 섹션 보이기
            filterSection.style.display = 'block';

            // 모든 product-card를 숨기기
            toggleProductCardsVisibility(false);

            // 확장된 카테고리 데이터 가져오기
            const url = `/category/api/categories/${categoryId}/expand`;
            const data = await fetchData(url);
            const categoriesToShow = data.categories;

            // 'name'이 'categoryId'와 일치하는 카테고리 찾기
            const subCategory = categoriesToShow.find(cat => cat.name === categoryId);
            console.log(subCategory.sub_category)

            // 선택된 카테고리와 추가 카테고리 표시
            selectedProductsContainer.innerHTML = '';
            categoriesToShow.forEach((category, index) => {
                const card = createProductCard(category);

                if (index === 0) {
                    card.classList.add('selected-product-card');
                    card.style.gridColumn = 'span 2';
                    card.style.border = '3px solid #007bff';
                }

                selectedProductsContainer.appendChild(card);
            });

            // 서브 카테고리 카드 생성 및 표시
            displaySubCategories(subCategory ? subCategory.sub_category : []);

            // 상세 데이터셋 목록 표시
            await loadDatasetPage(1);
        } catch (error) {
            console.error("Error in showFilterAndExpandCard:", error);
        }
    }

    function displaySubCategories(subCategories) {
        const subCategoryList = document.getElementById('subCategoryList');
        
        subCategoryList.style.display = 'flex';

        if (!subCategoryList) {
            console.error("subCategoryList 요소를 찾을 수 없습니다.");
            return;
        }
    
        // 기존 내용 초기화
        subCategoryList.innerHTML = '';
    
        // sub, detailed, detailed-icon 섹션 생성
        const subSection = document.createElement('div');
        subSection.id = 'subSection';
        subSection.classList.add('category-section');

    
        const detailedSection = document.createElement('div');
        detailedSection.id = 'detailedSection';
        detailedSection.classList.add('category-section');
        detailedSection.style.display = 'none'; // 기본적으로 숨김
    
        const detailedIconSection = document.createElement('div');
        detailedIconSection.id = 'detailedIconSection';
        detailedIconSection.classList.add('category-section');
        detailedIconSection.style.display = 'none'; // 기본적으로 숨김
    
        // 서브 카테고리 절반만 표시
        const halfLength = Math.ceil(subCategories.length / 2);
        const limitedSubCategories = subCategories.slice(0, halfLength);
    
        // 서브 카테고리 리스트 생성
        const subList = document.createElement('ul');
        subList.classList.add('category-list');
    
        limitedSubCategories.forEach(subCat => {
            const li = document.createElement('li');
            li.textContent = subCat;
            li.classList.add('category-item');
    
            // 클릭 시 detailed 섹션 표시
            li.addEventListener('click', () => {
                // 선택된 항목 하이라이트
                const allItems = subList.querySelectorAll('.category-item');
                allItems.forEach(item => item.classList.remove('selected'));
                li.classList.add('selected');
    
                // detailed 섹션 표시
                detailedSection.style.display = 'block';
                detailedIconSection.style.display = 'none';
                displayDetailedCategory(subCat);
            });
    
            subList.appendChild(li);
        });
    
        subSection.appendChild(subList);
    
        // detailed 카테고리 리스트 (내용 없음)
        const detailedList = document.createElement('ul');
        detailedList.classList.add('category-list');
        detailedSection.appendChild(detailedList);
    
        // detailed-icon 리스트 (이미지 표시)
        const detailedIconList = document.createElement('div');
        detailedIconList.classList.add('detailed-icon-list');
        detailedIconSection.appendChild(detailedIconList);
    
        // detailed 카테고리 클릭 시 detailed-icon 표시
        function displayDetailedCategory(selectedSubCat) {
            // detailed 섹션 내용 초기화
            detailedList.innerHTML = '';
    
            // 예시로 상세 카테고리 항목 생성 (실제 데이터에 맞게 수정)
            const exampleDetails = ['상세1', '상세2', '상세3'];
    
            exampleDetails.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                li.classList.add('category-item');
    
                li.addEventListener('click', () => {
                    // 선택된 항목 하이라이트
                    const allDetails = detailedList.querySelectorAll('.category-item');
                    allDetails.forEach(item => item.classList.remove('selected'));
                    li.classList.add('selected');
    
                    // detailed-icon 섹션 표시
                    detailedIconSection.style.display = 'block';
                    displayDetailedIcon(detail);
                });
    
                detailedList.appendChild(li);
            });
        }
    
        // detailed-icon 클릭 시 색상 변경 없이 이미지 표시
        function displayDetailedIcon(selectedDetail) {
            // detailed-icon 섹션 내용 초기화
            detailedIconList.innerHTML = '';

            const iconUrl = '/category/static/category/images/icon/small-category/detailed_dummy.svg'
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = 'Detailed Icon';
            img.classList.add('detailed-icon');

            detailedIconList.appendChild(img);

            }

            // 섹션들을 subCategoryList에 추가
            subCategoryList.appendChild(subSection);
            subCategoryList.appendChild(detailedSection);
            subCategoryList.appendChild(detailedIconSection);
    }

    // 제품 카드의 가시성 토글 함수
    function toggleProductCardsVisibility(visible) {
        const allProductCards = document.querySelectorAll('.product-card');
        allProductCards.forEach(card => {
            card.style.display = visible ? 'block' : 'none';
        });
    }

    // 데이터셋 페이지 로드 함수
    async function loadDatasetPage(page) {
        try {
            const url = `/category/api/datasets?main_category=${state.selectedCategoryId}&page=${page}&items_per_page=${state.itemsPerPage.dataset}`;
            const data = await fetchData(url);
            const datasets = data.datasets;

            datasetListContainer.innerHTML = '';

            if (datasets.length > 0) {
                datasets.forEach(dataset => {
                    const datasetElement = createDatasetCard(dataset);
                    datasetListContainer.appendChild(datasetElement);
                });

                const hasNext = datasets.length === state.itemsPerPage.dataset;
                renderPaginationUI(page, hasNext);
            } else {
                datasetListContainer.innerHTML = "<p>해당 카테고리에 데이터셋이 없습니다.</p>";
                renderPaginationUI(page, false);
            }
        } catch (error) {
            console.error("Error fetching datasets:", error);
        }
    }

    // 데이터셋 카드 템플릿 함수
    function createDatasetCard(dataset) {
        const div = document.createElement('div');
        div.classList.add('dataset-card');

        const thumbnail = dataset.thumbnail_info?.stored_name;
        const imageUrl = thumbnail ? `static/category/images/dataset-thumbnail/${thumbnail}` : null;

        if (imageUrl) {
            div.innerHTML = `
                <img class="dataset-thumbnail" src="${imageUrl}" alt="${dataset.title}" style="width:100px; height:100px;">
                <div class="dataset-info">
                    <h5>${dataset.title}</h5>
                    <p>${dataset.description}</p>
                    <div class="dataset-meta" style='font-size: 0.65rem;'>
                        <span>💰 ${dataset.price}</span> · 
                        <span>📄 ${dataset.sub_category} - ${dataset.detailed_category}</span>
                        <span>⌛️ ${dataset.upload_time}</span>
                    </div>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="dataset-info">
                    <h5>${dataset.title}</h5>
                    <p>${dataset.description}</p>
                    <div class="dataset-meta" style='font-size: 0.65rem;'>
                        <span>💰 ${dataset.price}</span> · 
                        <span>📄 ${dataset.sub_category}</span>
                        <span>⌛️ ${dataset.upload_time}</span>
                    </div>
                </div>
            `;
        }

        div.addEventListener('click', () => {
            window.location.href = `/category/detail/${state.selectedCategoryId}`;
        });

        return div;
    }

    // 필터 적용 함수
    function applyFilters() {
        // 필터링 로직 구현
        alert('필터가 적용되었습니다.');
    }

    // 필터 초기화 함수
    function resetFilters() {
        // 필터 초기화 로직 구현
        alert('필터가 초기화되었습니다.');
    }

    // 검색 수행 함수
    async function performSearch() {
        try {
            const searchQuery = searchInput.value.trim();
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

            const data = await fetchData(searchUrl);
            const datasets = data.datasets || data; // API 응답 구조에 따라 조정

            datasetListContainer.innerHTML = '';

            if (datasets.length > 0) {
                datasets.forEach(dataset => {
                    const datasetElement = createDatasetCard(dataset);
                    datasetListContainer.appendChild(datasetElement);
                });

                const hasNext = datasets.length === state.itemsPerPage.dataset;
                renderPaginationUI(state.currentDatasetPage, hasNext);
            } else {
                datasetListContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
                renderPaginationUI(state.currentDatasetPage, false);
            }
        } catch (error) {
            console.error("Error performing search:", error);
            datasetListContainer.innerHTML = "<p>검색 중 오류가 발생했습니다. 다시 시도해주세요.</p>";
        }
    }

    // 뒤로 가기 함수
    function goBack() {
        window.history.back();
    }
});

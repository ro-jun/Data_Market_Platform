document.addEventListener("DOMContentLoaded", () => {
    // 상태 관리 객체
    const state = {
        currentProductPage: 1,
        currentDatasetPage: 1,
        itemsPerPage: { product: 5, dataset: 6 },
        currentMode: 'product', // 'product' 또는 'dataset'
        selectedCategoryId: null,
        selectedSubCategory: null,   
        selectedDetailedCategory: null,  
        allCategories: [],
    };

    // DOM 요소
    const paginationSpan = document.querySelector('.pagination span');
    const previousButton = document.querySelector('.pagination button:first-child');
    const nextButton = document.querySelector('.pagination button:last-child');
    const categorySelect = document.getElementById('categorySelect');
    const selectedProductsContainer = document.getElementById('selected-products-container');
    const datasetListContainer = document.getElementById('dataset-list-container');
    const filterSection = document.getElementById('filter-section');
    const searchInput = document.getElementById('searchInput');

    // 초기화
    initialize();

    async function initialize() {
        try {
            await fetchCategories(state.currentProductPage);
            addEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

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

    function populateCategorySelect(categories) {
        categorySelect.innerHTML = '<option value="">카테고리</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

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

    function populateProductCards(categories) {
        selectedProductsContainer.innerHTML = '';
        categories.forEach(category => {
            const card = createProductCard(category);
            selectedProductsContainer.appendChild(card);
        });
    }

    function renderPaginationUI(current, hasNext) {
        paginationSpan.textContent = `페이지 ${current}`;
        previousButton.disabled = current === 1;
        nextButton.disabled = !hasNext;
    }

    function addEventListeners() {
        previousButton.addEventListener('click', handlePreviousPage);
        nextButton.addEventListener('click', handleNextPage);
        categorySelect.addEventListener('change', handleCategoryChange);

        const applyFilterBtn = document.getElementById('applyFilterButton');
        if (applyFilterBtn) applyFilterBtn.addEventListener('click', applyFilters);

        const resetFilterBtn = document.getElementById('resetFilterButton');
        if (resetFilterBtn) resetFilterBtn.addEventListener('click', resetFilters);

        const searchBtn = document.getElementById('searchButton');
        if (searchBtn) searchBtn.addEventListener('click', performSearch);

        const backBtn = document.getElementById('backButton');
        if (backBtn) backBtn.addEventListener('click', goBack);
    }

    function handlePreviousPage() {
        if (state.currentMode === 'product' && state.currentProductPage > 1) {
            state.currentProductPage--;
            fetchCategories(state.currentProductPage);
        } else if (state.currentMode === 'dataset' && state.currentDatasetPage > 1) {
            state.currentDatasetPage--;
            loadDatasetPage(state.currentDatasetPage);
        }
    }

    function handleNextPage() {
        if (state.currentMode === 'product') {
            state.currentProductPage++;
            fetchCategories(state.currentProductPage);
        } else if (state.currentMode === 'dataset') {
            state.currentDatasetPage++;
            loadDatasetPage(state.currentDatasetPage);
        }
    }

    function handleCategoryChange() {
        const selectedCategory = categorySelect.value;
        if (selectedCategory) {
            showFilterAndExpandCard(selectedCategory, 1);
        }
    }

    async function showFilterAndExpandCard(categoryId, page = 1) {
        try {
            state.selectedCategoryId = categoryId;
            state.currentMode = 'dataset';
            state.currentDatasetPage = page;
            state.selectedSubCategory = null;    
            state.selectedDetailedCategory = null; 

            // 필터 섹션 보이기
            if (filterSection) filterSection.style.display = 'block';

            // 모든 product-card를 숨기기
            toggleProductCardsVisibility(false);

            const url = `/category/api/categories/${categoryId}/expand`;
            const data = await fetchData(url);
            const categoriesToShow = data.categories;

            const subCategory = categoriesToShow.find(cat => cat.name === categoryId);

            // 카테고리 표시
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

            // 서브카테고리 표시
            displaySubCategories(subCategory ? subCategory.sub_category : []);

            // 초기 dataset 로드
            await loadDatasetPage(1);
        } catch (error) {
            console.error("Error in showFilterAndExpandCard:", error);
        }
    }

    function displaySubCategories(subCategories) {
        const subCategoryList = document.getElementById('subCategoryList');

        if (!subCategoryList) {
            console.error("subCategoryList 요소를 찾을 수 없습니다.");
            return;
        }

        subCategoryList.style.display = 'flex';
        subCategoryList.innerHTML = '';

        const subSection = document.createElement('div');
        subSection.id = 'subSection';
        subSection.classList.add('category-section');

        const detailedSection = document.createElement('div');
        detailedSection.id = 'detailedSection';
        detailedSection.classList.add('category-section');
        detailedSection.style.display = 'none';

        const detailedIconSection = document.createElement('div');
        detailedIconSection.id = 'detailedIconSection';
        detailedIconSection.classList.add('category-section');
        detailedIconSection.style.display = 'none';

        const subList = document.createElement('ul');
        subList.classList.add('category-list');

        Object.keys(subCategories).forEach(subCat => {
            const li = document.createElement('li');
            li.textContent = subCat;
            li.classList.add('category-item');

            li.addEventListener('click', () => {
                // 선택 UI
                const allItems = subList.querySelectorAll('.category-item');
                allItems.forEach(item => item.classList.remove('selected'));
                li.classList.add('selected');

                // 선택한 subCategory 저장
                state.selectedSubCategory = subCat;
                state.selectedDetailedCategory = null;

                // detailedSection 표시
                detailedSection.style.display = 'block';
                detailedIconSection.style.display = 'none';
                displayDetailedCategory(subCategories, subCat, detailedSection, detailedIconSection);

                // sub category 선택 시 dataset 재로딩
                loadDatasetPage(1);
            });

            subList.appendChild(li);
        });

        subSection.appendChild(subList);
        subCategoryList.appendChild(subSection);
        subCategoryList.appendChild(detailedSection);
        subCategoryList.appendChild(detailedIconSection);
    }

    function displayDetailedCategory(subCategories, selectedSubCat, detailedSection, detailedIconSection) {
        detailedSection.innerHTML = '';
        const detailedList = document.createElement('ul');
        detailedList.classList.add('category-list');
        detailedSection.appendChild(detailedList);

        const detailedCategories = subCategories[selectedSubCat] || [];

        if (detailedCategories.length === 0) {
            const li = document.createElement('li');
            li.textContent = "등록된 상세 카테고리가 없습니다.";
            li.classList.add('category-item');
            detailedList.appendChild(li);
            return;
        }

        detailedCategories.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            li.classList.add('category-item');

            li.addEventListener('click', () => {
                // 선택 UI
                const allDetails = detailedList.querySelectorAll('.category-item');
                allDetails.forEach(item => item.classList.remove('selected'));
                li.classList.add('selected');

                state.selectedDetailedCategory = detail;

                // detailedIconSection 표시
                // detailedIconSection.style.display = 'block';
                // displayDetailedIcon(detail, detailedIconSection);

                // detailed category 선택 시 dataset 재로딩
                loadDatasetPage(1);
            });

            detailedList.appendChild(li);
        });
    }

    function displayDetailedIcon(selectedDetail, detailedIconSection) {
        detailedIconSection.innerHTML = '';
        const detailedIconList = document.createElement('div');
        detailedIconList.classList.add('detailed-icon-list');
        detailedIconSection.appendChild(detailedIconList);

        const iconUrl = '/category/static/category/images/icon/small-category/detailed_dummy.svg';
        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = 'Detailed Icon';
        img.classList.add('detailed-icon');

        detailedIconList.appendChild(img);
    }

    function toggleProductCardsVisibility(visible) {
        const allProductCards = document.querySelectorAll('.product-card');
        allProductCards.forEach(card => {
            card.style.display = visible ? 'block' : 'none';
        });
    }

    async function loadDatasetPage(page) {
        try {
            const mainCategory = state.selectedCategoryId || '';
            const subCategory = state.selectedSubCategory || '';
            const detailedCategory = state.selectedDetailedCategory || '';

            const url = `/category/api/datasets?main_category=${encodeURIComponent(mainCategory)}&sub_category=${encodeURIComponent(subCategory)}&detailed_category=${encodeURIComponent(detailedCategory)}&page=${page}&items_per_page=${state.itemsPerPage.dataset}`;
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
                        <span>📄 ${dataset.sub_category} - ${dataset.detailed_category}</span>
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

    function applyFilters() {
        // 필터 적용 로직
        alert('필터가 적용되었습니다.');
    }

    function resetFilters() {
        // 필터 초기화 로직
        alert('필터가 초기화되었습니다.');
    }

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
            const datasets = data.datasets || data;

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

    function goBack() {
        window.history.back();
    }
});

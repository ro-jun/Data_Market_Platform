function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  // 모든 탭과 콘텐츠 비활성화
  tabs.forEach(tab => tab.classList.remove('active'));
  contents.forEach(content => content.style.display = 'none');

  // 선택한 탭과 콘텐츠 활성화
  document.querySelector(`#${tabId}`).style.display = 'block';
  document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
}

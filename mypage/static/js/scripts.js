document.addEventListener("DOMContentLoaded", () => {
    // 버튼 ID
    const buttons = {
        findData: "데이터 찾기를 클릭했습니다!",
        buyData: "삽니다 버튼을 클릭했습니다!",
        sellData: "팝니다 버튼을 클릭했습니다!",
        freeData: "무료 데이터를 클릭했습니다!"
    };

    // 각 버튼에 이벤트 추가
    for (const [id, message] of Object.entries(buttons)) {
        document.getElementById(id).addEventListener("click", () => {
            alert(message);
        });
    }
});

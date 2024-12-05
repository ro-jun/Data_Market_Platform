// DOM 요소 선택
const sendButton = document.querySelector(".send-btn");
const userInput = document.querySelector("#user-input");
const messagesSection = document.querySelector("#messages");
const newChatBtn = document.querySelector("#new-chat-btn");
const chatHistory = document.querySelector(".chat-history ul");

// 초기 메시지 로드
document.addEventListener("DOMContentLoaded", () => {
    fetch("/chatbot/init")
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                addMessage(data.message, "bot");
            }
        })
        .catch((error) => console.error("초기 메시지 로드 실패:", error));
});

// 메시지를 추가하는 함수
function addMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender); // 사용자 또는 챗봇에 따라 스타일 적용
    messageDiv.innerHTML = message.replace(/\n/g, "<br>");
    messagesSection.appendChild(messageDiv);
    messagesSection.scrollTop = messagesSection.scrollHeight; // 스크롤을 가장 아래로 이동
}

// 검색 결과를 추가하는 함수
function addRecommendations(recommendations) {
    const recommendationDiv = document.createElement("div");
    recommendationDiv.classList.add("recommendations");

    // 검색 결과 리스트 생성
    recommendations.forEach((rec) => {
        const recItem = document.createElement("div");
        recItem.classList.add("recommendation-item");
        recItem.innerHTML = `
            <strong>${rec.id}</strong> - Score: ${rec.score.toFixed(2)}<br>
            <p>${rec.metadata.description}</p>
        `;
        recommendationDiv.appendChild(recItem);
    });

    messagesSection.appendChild(recommendationDiv);
    messagesSection.scrollTop = messagesSection.scrollHeight; // 스크롤을 가장 아래로 이동
}

// 서버로 메시지 전송 및 응답 처리
sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (!message) {
        alert("메시지를 입력해주세요.");
        return;
    }

    // 사용자 메시지 추가
    addMessage(message, "user");
    userInput.value = ""; // 입력 필드 초기화

    // 서버로 메시지 전송
    fetch("/chatbot/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: "default_user", message: message }), // user_id 포함
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("서버 응답에 문제가 있습니다.");
            }
            return response.json();
        })
        .then((data) => {
            console.log("서버 응답 데이터:", data); // 디버깅용 로그
            if (data.reply) {
                addMessage(data.reply, "bot");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            addMessage("서버와의 연결이 원활하지 않습니다.", "bot");
        });
});

// Enter 키로 메시지 전송
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendButton.click();
    }
});

// 새 채팅하기 버튼 클릭 이벤트
newChatBtn.addEventListener("click", () => {
    fetch("/chatbot/new_chat", { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                // 새로운 채팅 아이템 추가
                const newChat = document.createElement("li");
                newChat.textContent = `새 채팅 ${chatHistory.children.length + 1}`;
                chatHistory.appendChild(newChat);
            }
        })
        .catch((error) => console.error("새 채팅 생성 실패:", error));
});

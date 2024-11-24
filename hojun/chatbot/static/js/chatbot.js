// DOM 요소 선택
const sendButton = document.querySelector(".send-btn");
const userInput = document.querySelector("#user-input");
const messagesSection = document.querySelector("#messages");
const newChatBtn = document.querySelector("#new-chat-btn");
const chatHistory = document.querySelector(".chat-history ul");

// 메시지를 추가하는 함수
function addMessage(message, sender = "user") {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender); // 사용자 또는 챗봇에 따라 스타일 적용
    messageDiv.textContent = message;
    messagesSection.appendChild(messageDiv);
    messagesSection.scrollTop = messagesSection.scrollHeight; // 스크롤을 가장 아래로 이동
}

// 서버에서 전달된 메세지 불러오기
fetch("/chatbot/history", {
    method: "GET",
})
    .then((response) => response.json())
    .then((data) => {
        data.history.forEach((msg) => addMessage(msg.content, msg.role));
    });
    
// 버튼 클릭 이벤트
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
        body: JSON.stringify({ message: message }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.reply) {
                // 챗봇 응답 메시지 추가
                addMessage(data.reply, "bot");
            } else {
                addMessage("오류가 발생했습니다.", "bot");
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
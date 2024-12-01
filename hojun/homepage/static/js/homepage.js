// DOM 요소 선택
const sendButton = document.querySelector(".send-btn");
const userInput = document.querySelector("#user-input");
const messagesSection = document.querySelector("#messages");

// 메시지를 추가하는 함수
function addMessage(message, sender = "user") {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    messagesSection.appendChild(messageDiv);
    messagesSection.scrollTop = messagesSection.scrollHeight; // 스크롤을 가장 아래로
}

// 버튼 클릭 이벤트
sendButton.addEventListener("click", () => {
    const message = userInput.value.trim(); // 사용자 입력 값 가져오기
    if (message === "") {
        alert("메시지를 입력해주세요.");
        return;
    }

    addMessage(message, "user"); // 사용자가 보낸 메시지 추가
    userInput.value = ""; // 입력 필드 초기화

    // 서버에 메시지 전송
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
                addMessage(data.reply, "bot"); // 서버의 응답 메시지 추가
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
        sendButton.click(); // Enter 키로 전송 버튼 클릭 효과
    }
});
import { addMessage } from "./utils.js";
import { sendButton, userInput, messagesSection, newChatBtn, chatHistory } from "./selectors.js";

// 초기 메시지 로드 함수
export function initializeChatbot() {
    fetch("/chatbot/init")
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                messagesSection.innerHTML = ""; // 기존 메시지 초기화
                addMessage(data.message, "bot", messagesSection);
            }
        })
        .catch((error) => console.error("초기 메시지 로드 실패:", error));
}

// 메시지 전송 함수
export function handleSendMessage() {
    sendButton.addEventListener("click", () => {
        const message = userInput.value.trim();
        if (!message) {
            alert("메시지를 입력해주세요.");
            return;
        }

        // 사용자 메시지 추가
        addMessage(message, "user", messagesSection);
        userInput.value = "";

        // 서버로 메시지 전송
        fetch("/chatbot/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: "default_user", message: message }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("서버 응답에 문제가 있습니다.");
                }
                return response.json();
            })
            .then((data) => {
                if (data.reply) {
                    addMessage(data.reply, "bot", messagesSection);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                addMessage("서버와의 연결이 원활하지 않습니다.", "bot", messagesSection);
            });
    });

    // Enter 키로 메시지 전송
    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // 기본 동작 방지
            sendButton.click(); // 메시지 전송
        } else if (event.key === "Enter" && event.shiftKey) {
            // 기본 동작(줄 바꿈)을 허용
            return;
        }
    });
}

// 새 채팅하기 버튼 클릭 이벤트 함수
export function handleNewChat() {
    newChatBtn.addEventListener("click", () => {
        fetch("/chatbot/new_chat", { method: "POST" })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    // 새로운 채팅 아이템 추가
                    const newChat = document.createElement("li");
                    newChat.textContent = `새 채팅 ${chatHistory.children.length + 1}`;
                    chatHistory.appendChild(newChat);
                    // 메시지 영역 초기화
                    messagesSection.innerHTML = "";
                    // 초기 메시지 추가
                    initializeChatbot();
                }
            })
            .catch((error) => console.error("새 채팅 생성 실패:", error));
    });
}

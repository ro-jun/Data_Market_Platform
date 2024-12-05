import { initializeChatbot, handleSendMessage, handleNewChat } from "./events.js";

initializeChatbot(); // 초기 메시지 로드
handleSendMessage(); // 메시지 전송 핸들러
handleNewChat();     // 새 채팅하기 핸들러
export function addMessage(message, sender, messagesSection) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerHTML = message.replace(/\n/g, "<br>");
    messagesSection.appendChild(messageDiv);
    messagesSection.scrollTop = messagesSection.scrollHeight;
}

export function addRecommendations(recommendations, messagesSection) {
    const recommendationDiv = document.createElement("div");
    recommendationDiv.classList.add("recommendations");

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
    messagesSection.scrollTop = messagesSection.scrollHeight;
}
